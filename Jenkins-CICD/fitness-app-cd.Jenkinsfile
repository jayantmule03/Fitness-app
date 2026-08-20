@Library('Shared') _

pipeline {

    agent any

    parameters {
        string(
            name: 'DOCKER_TAG',
            defaultValue: '',
            description: 'Docker tag of the image built by CI'
        )
    }

    environment {
        GIT_REPO = 'https://github.com/jayantmule03/Fitness-app.git'
        ARGOCD_APP = 'fitness-app'
        ARGOCD_SERVER = credentials('argocd-server')
    }

    stages {

        stage('Workspace Cleanup') {
            steps {
                script {
                    cleanWs()
                }
            }
        }

        stage('Git: Code Checkout') {
            steps {
                script {
                    clone(
                        "${env.GIT_REPO}",
                        "main"
                    )
                }
            }
        }

        stage('Verify: Docker Image Tag') {
            steps {
                script {

                    echo "Docker Tag Received: ${params.DOCKER_TAG}"

                    if (!params.DOCKER_TAG?.trim()) {
                        error("DOCKER_TAG cannot be empty")
                    }
                }
            }
        }




        stage('Argo CD: Login') {
            steps {
                script {

                    withCredentials([
                        string(
                            credentialsId: 'argocd-auth-token',
                            variable: 'ARGOCD_AUTH_TOKEN'
                        )
                    ]) {

                        sh '''
                            argocd login ${ARGOCD_SERVER} \
                                --auth-token "$ARGOCD_AUTH_TOKEN" \
                                --grpc-web \
                                --insecure
                        '''
                    }
                }
            }
        }


        stage('Argo CD: Application Sync') {
            steps {
                script {

                    echo "Syncing Argo CD application: ${env.ARGOCD_APP}"

                    sh '''
                        argocd app sync ${ARGOCD_APP}
                    '''
                }
            }
        }


        stage('Argo CD: Wait for Deployment') {
            steps {
                script {

                    echo "Waiting for Kubernetes deployment..."

                    sh '''
                        argocd app wait ${ARGOCD_APP} \
                            --health \
                            --sync \
                            --timeout 600
                    '''
                }
            }
        }


        stage('Argo CD: Verify Application') {
            steps {
                script {

                    sh '''
                        argocd app get ${ARGOCD_APP}
                    '''
                }
            }
        }
    }

    post {

        success {
            echo '============================================'
            echo 'Fitness Application deployed successfully!'
            echo 'Deployment handled by Argo CD.'
            echo '============================================'
        }

        failure {
            echo '============================================'
            echo 'Argo CD deployment failed.'
            echo 'Check Jenkins and Argo CD logs.'
            echo '============================================'
        }
    }
}