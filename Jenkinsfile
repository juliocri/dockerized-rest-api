pipeline {
  agent none
  stages {
    stage('Test') {
      agent {
        label "builder"
      }
      steps {
        sh 'sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
        sh 'sudo chmod +x /usr/local/bin/docker-compose'
        sh 'docker-compose build'
        sh 'docker-compose up -d'
        sh 'sleep 30s'
        sh 'curl http://localhost:3000'
      }
      post {
        always {
          sh 'docker-compose stop && docker-compose rm -f'
          sh 'docker system prune -a -f'
        }
      }
    }
  }
}
