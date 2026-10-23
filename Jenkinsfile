pipeline {
  agent any
  options { timestamps(); skipDefaultCheckout(true) }
  environment { IMAGE_TAG = "${env.GIT_COMMIT}" }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install') { steps { sh 'npm ci --prefix backend'; sh 'npm ci --prefix frontend' } }
    stage('Quality and tests') { steps { sh 'npm run lint --prefix backend'; sh 'npm test --prefix backend' } }
    stage('Security gates') { steps { sh 'npm audit --prefix backend --audit-level=high'; sh 'npm audit --prefix frontend --audit-level=high' } }
    stage('Build') { steps { sh 'npm run build --prefix frontend'; sh 'docker build -f docker/backend.Dockerfile -t secure-banking-api:${IMAGE_TAG} .'; sh 'docker build -f docker/frontend.Dockerfile -t secure-banking-web:${IMAGE_TAG} .' } }
    stage('Deploy demo') {
      when { expression { return env.DEPLOY_DEMO == 'true' } }
      steps { sh 'docker compose up -d'; sh 'curl --fail http://localhost:4000/health' }
    }
  }
  post { always { archiveArtifacts artifacts: 'backend/coverage/**', allowEmptyArchive: true } }
}

