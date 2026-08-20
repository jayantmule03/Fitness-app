@Library('Shared') _
pipeline {
    agent any

    parameters {
        string(
            name: 'DOCKER_TAG',
            defaultValue: '',
            description: 'Docker image tag'
        )
    }

    stages {

        stage("Workspace cleanup") {
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
                        "https://github.com/jayantmule03/Fitness-app.git",
                        "main"
                    )
                }
            }
        }

        stage("Docker: Build Images") {
            parallel {

                stage("Build Frontend") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/fitness-frontend",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "frontend/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build API Gateway") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/api-gateway",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "api-gateway/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build User Service") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/user-service",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "user-service/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build Activity Service") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/activity-service",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "activity-service/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build AI Service") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/ai-service",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "ai-service/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build Config Server") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/config-server",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "config-server/Dockerfile"
                            )
                        }
                    }
                }

                stage("Build Eureka Server") {
                    steps {
                        script {
                            dockerbuild(
                                imageName: "jayantmule02/eureka-server",
                                imageTag: params.DOCKER_TAG,
                                dockerfilePath: "eureka-server/Dockerfile"
                            )
                        }
                    }
                }
            }
        }



        stage("Docker: Push Images to DockerHub") {
            parallel {

                stage("Push Frontend") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/fitness-frontend",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push API Gateway") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/api-gateway",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push User Service") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/user-service",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push Activity Service") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/activity-service",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push AI Service") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/ai-service",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push Config Server") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/config-server",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }

                stage("Push Eureka Server") {
                    steps {
                        script {
                            dockerpush(
                                imageName: "jayantmule02/eureka-server",
                                imageTag: params.DOCKER_TAG,
                                credentials: "docker"
                            )
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "=============================================="
            echo " FITNESS APP CI PIPELINE SUCCESSFUL"
            echo " Docker images pushed successfully"
            echo " Tag: ${params.DOCKER_TAG}"
            echo "=============================================="
        }

        failure {
            echo "=============================================="
            echo " FITNESS APP CI PIPELINE FAILED"
            echo "=============================================="
        }
    }
}