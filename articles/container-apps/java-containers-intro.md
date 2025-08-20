---
title: Introduction to Containers for Java Applications
description: Learn the basics of using containers for Java applications.
author: KarlErickson
ms.reviewer: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/23/2025
ms.author: karler
ms.custom: devx-track-java
ai-usage: ai-generated
---

# Introduction to containers for Java applications

Containers provide a consistent, portable environment for your Java applications across development, testing, and production stages. This article introduces containerization concepts for Java applications and guides you through creating, debugging, optimizing, and deploying containerized Java applications to Azure Container Apps.

In this article, you learn essential containerization concepts for Java developers and the following skills:

- Setting up your development environment for containerized Java applications.
- Creating Dockerfiles optimized for Java workloads.
- Configuring local development workflows with containers.
- Debugging containerized Java applications.
- Optimizing Java containers for production.
- Deploying your containerized Java applications to Azure Container Apps.

By containerizing your Java applications, you get consistent environments, simplified deployment, efficient resource utilization, and improved scalability.

## Containers for Java applications

Containers package applications with their dependencies, ensuring consistency across environments. For Java developers, this means bundling the application, its dependencies, the Java Runtime Environment/Java Development Kit (JRE/JDK), and configuration files into a single, portable unit.

Containerization has key advantages over virtualization that makes it ideal for cloud development. In contrast to a virtual machine, a container runs on a server's host OS kernel. This is beneficial for Java applications, which already run in the Java virtual machine (JVM). Containerizing Java applications adds minimal overhead and provides significant deployment benefits.

The container ecosystem includes the following key components:

- Images - the blueprints.
- Containers - running instances.
- Registries - where images are stored.
- Orchestrators - systems that manage containers at scale.

Docker is the most popular containerization platform, and it's well supported in the Azure ecosystem through Azure Container Apps.

## Set up your development environment

This section guides you through installing the necessary tools and configuring your development environment to build, run, and debug containerized Java applications.

### Install required tools

To containerize Java applications, you need the following tools installed on your development machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/). Provides the Docker engine, CLI, and Docker Compose for Windows or macOS.
- [Visual Studio Code](https://code.visualstudio.com/download). Available as a free code editor.
- The following Visual Studio Code extensions:
  - [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for managing containers.
  - [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) for Java development.
  - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for developing inside containers.

Verify your installation by using the following commands:

```bash
docker --version
docker compose version
```

### Configure Visual Studio Code for container development

For Java development in containers, configure Visual Studio Code by installing the Java Extension Pack and setting up your JDK. The Dev Containers extension enables you to open any folder inside a container and use Visual Studio Code's full feature set inside that container.

To enable Visual Studio Code to automatically build and connect to a development container, create a **.devcontainer/devcontainer.json** file in your project.

For instance, the following example configuration defines a Java build:

```json
{
    "name": "Java Development",
    "image": "mcr.microsoft.com/devcontainers/java:21",
    "customizations": {
        "vscode": {
            "extensions": [
                "vscjava.vscode-java-pack",
                "ms-azuretools.vscode-docker"
            ]
        }
    },
    "forwardPorts": [8080, 5005],
    "remoteUser": "vscode"
}
```

This configuration uses Microsoft's Java development container image, adds essential extensions, and forwards both the application port, `8080`, and the debugging port, `5005`.

## Create a Dockerfile

A **Dockerfile** contains instructions for building a Docker image. For Java applications, the **Dockerfile** typically includes the following components:

- A base image with the JDK or JRE.
- Instructions to copy application files.
- Commands to set environment variables.
- Configurations of entry points.

### Select a base image

Choosing the right base image is crucial. Consider these options:

| Description                        | Name                                        | Remarks                                                 |
|------------------------------------|---------------------------------------------|---------------------------------------------------------|
| Microsoft Java development Image   | `mcr.microsoft.com/java/jdk:21-zulu-ubuntu` | Full JDK and optimized for Azure |
| Microsoft Java production Image    | `mcr.microsoft.com/java/jre:21-zulu-ubuntu` | Runtime only and optimized for Azure                    |
| Official OpenJDK development Image | `openjdk:21-jdk`                            | Full JDK                                                |
| Official OpenJDK production Image  | `openjdk:21-jre`                            | Runtime only                                            |

For development environments, use a full JDK image. For production, use a JRE or distroless image to minimize the size and attack surface of your application.

The Microsoft Java images come with Azure-specific optimizations and are regularly updated with security patches, making them ideal for applications targeting Azure Container Apps.

### Basic Dockerfile examples

The following example shows a simple **Dockerfile** for a Java application:

```dockerfile
FROM mcr.microsoft.com/java/jdk:21-zulu-ubuntu
WORKDIR /app
COPY target/myapp.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

For Spring Boot applications, you can set up your **Dockerfile** with the following base:

```dockerfile
FROM mcr.microsoft.com/java/jdk:21-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]
```

For production deployments, use the JRE image shown in the following example to reduce the size and minimize the attack surface of your application:

```dockerfile
FROM mcr.microsoft.com/java/jre:21-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Dserver.port=8080"
ENTRYPOINT ["java", ${JAVA_OPTS}, "-jar", "app.jar"]
```

## Local development with containers

Containers are meant to execute in various contexts. In this section, you learn a local development flow for use with containers.

### Use Docker Compose for multi-container applications

Most Java applications interact with databases, caches, or other services. Docker Compose helps you define and orchestrate multi-container applications using a simple YAML configuration file.

#### What is Docker Compose?

Docker Compose is a tool that enables you to perform the following tasks:

- Define multi-container applications in a single file.
- Manage the application lifecycle, including start, stop, and rebuild.
- Maintain isolated environments.
- Create networks for service communication.
- Persist data using volumes.

#### Example: Java application with database

The following **compose.yml** file configures a Java application with a PostgreSQL database:

```yaml
version: '3.8'
services:
  app:
    build: .                              # Build from Dockerfile in current directory
    ports:
      - "8080:8080"                       # Map HTTP port
      - "5005:5005"                       # Map debug port
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp
    volumes:
      - ./target:/app/target              # Mount target directory for hot reloads
    depends_on:
      - db                                # Ensure database starts first
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"                       # Expose PostgreSQL port
    volumes:
      - postgres-data:/var/lib/postgresql/data  # Persist database data

volumes:
  postgres-data:                          # Named volume for database persistence
```

This file has the following characteristics:

- Services can reference each other by name - for example, `db` in the JDBC URL.
- Docker Compose automatically creates a network for the services.
- The Java application waits for the database to start, due to `depends_on`.
- The database data persists across restarts using a named volume.

#### Common Docker Compose commands

After you create your **compose.yml** file, manage your application by using the following commands:

```bash
# Build images without starting containers
docker compose build

# Start all services defined in compose.yml
docker compose up

# Start in detached mode (run in background)
docker compose up -d

# View running containers managed by compose
docker compose ps

# View logs from all containers
docker compose logs

# View logs from a specific service
docker compose logs app

# Stop all services
docker compose down

# Stop and remove volumes (useful for database resets)
docker compose down -v
```

#### Development workflow

A typical Java development workflow using Docker Compose contains the following steps:

1. Create the **compose.yml** file and the **Dockerfile**.
1. Run `docker compose up` to start all services.
1. Make changes to your Java code.
1. Rebuild your application. Depending on the configuration, you might need to restart your containers.
1. Test the changes in the containerized environment.
1. When you're finished, run `docker compose down`.

### Run single containers with Docker

For simpler scenarios when you don't need multiple interconnected services, you can use the `docker run` command to start individual containers.

The following Docker commands are typical for Java applications:

```bash
# Run a Java application JAR directly
docker run -p 8080:8080 myapp:latest

# Run with environment variables
docker run -p 8080:8080 -e "SPRING_PROFILES_ACTIVE=prod" myapp:latest

# Run in detached mode (background)
docker run -d -p 8080:8080 myapp:latest

# Run with a name for easy reference
docker run -d -p 8080:8080 --name my-java-app myapp:latest

# Run with volume mount for persistent data
docker run -p 8080:8080 -v ./data:/app/data myapp:latest
```

## Debug containerized applications

Debugging containerized Java applications is sometimes challenging because your code runs in an isolated environment inside the container.

Standard debugging approaches don't always directly apply, but with the right configuration, you can establish a remote debugging connection to your application. This section shows you how to configure your containers for debugging, connect your development tools to running containers, and troubleshoot common container-related issues.

### Set up remote debugging

Debugging containerized Java applications requires exposing a debug port and configuring your IDE to connect to it. You can accomplish these tasks by using the following steps:

1. To enable debugging, modify your **Dockerfile** so it contains the following content:

    > [!NOTE]
    > You can modify your container startup command, instead.

    ```dockerfile
    FROM mcr.microsoft.com/java/jdk:21-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    EXPOSE 8080 5005
    ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
    ```

1. Configure Visual Studio Code's **launch.json** file to connect to the debug port, as shown in the following example:

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        {
          "type": "java",
          "name": "Debug in Container",
          "request": "attach",
          "hostName": "localhost",
          "port": 5005
        }
      ]
    }
    ```

1. Start your container with port `5005` mapped to your host, and then launch the debugger in Visual Studio Code.

### Troubleshoot container issues

When containers don't behave as expected, you can inspect your app's logs to investigate the issue.

Use the following commands to troubleshoot your application. Before you run these commands, make sure to replace the placeholders (`<...>`) with your own values.

```bash
# View logs
docker logs <CONTAINER_ID>

# Follow logs in real-time
docker logs -f <CONTAINER_ID>

# Inspect container details
docker inspect <CONTAINER_ID>

# Get a shell in the container
docker exec -it <CONTAINER_ID> bash
```

For Java-specific issues, enable the JVM flags for better diagnostics, as shown in the following example:

```dockerfile
ENTRYPOINT ["java", "-XX:+PrintFlagsFinal", "-XX:+PrintGCDetails", "-jar", "app.jar"]
```

The following table lists common issues and corresponding solutions:

| Error                | Possible solution                                                       |
|----------------------|-------------------------------------------------------------------------|
| Out of memory        | Increase container memory limits                                        |
| Connection time-outs | Check network configuration for errors. Verify ports and routing rules. |
| Permission problems  | Verify file system permissions.                                         |
| Classpath issues     | Check JAR structure and dependencies.                                   |

## Optimize Java containers

Java applications in containers require special consideration for optimal performance. The JVM was designed before containers were common. Using containers can lead to resource allocation issues if they aren't properly configured.

You can significantly improve the performance and efficiency of your containerized Java applications by fine-tuning memory settings, optimizing the image size, and configuring garbage collection. This section covers essential optimizations for Java containers, with a focus on memory management, startup time, and resource utilization.

### JVM memory configuration in containers

The JVM doesn't automatically detect container memory limits in Java 8. For Java 9+, container awareness is enabled by default.

Configure your JVM to respect container limits, as shown in the following example:

```dockerfile
FROM mcr.microsoft.com/java/jre:21-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

The following JVM flags are important for containerized applications:

- `-XX:MaxRAMPercentage=75.0`. Sets maximum heap as a percentage of available memory.
- `-XX:InitialRAMPercentage=50.0`. Sets initial heap size.
- `-Xmx` and `-Xms`. These flags are also available, but they require fixed values.

## Prepare for production deployment

Moving containerized Java applications to production requires considerations beyond basic functionality.

Production environments demand robust security, reliable monitoring, proper resource allocation, and configuration flexibility.

This section covers the essential practices and configurations needed to prepare your Java containers for production use. The section focuses on security, health checks, and configuration management, to ensure your applications run reliably in production.

### Security best practices

Secure your containerized Java applications by using the following practices:

- Default security context. Run your applications as a non-root user, as shown in the following example:

    ```dockerfile
    FROM mcr.microsoft.com/java/jre:21-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
    USER javauser
    ENTRYPOINT ["java", "-jar", "app.jar"]
    ```

- Proactively look for issues. Regularly scan container images for vulnerabilities by using the following command:

    ```bash
    docker scan myapp:latest
    ```

- Base image freshness. Keep your base images up to date.
- Secrets management. Implement proper secrets management. For instance, don't hard-code sensitive data into your application, and use a key vault whenever possible.
- Restricted security contexts. Apply the principle of least privilege to all security contexts.
- File system access. Use read-only file systems wherever possible.

### Health checks and monitoring

Check application health with [probes](health-probes.md) to ensure your application is running correctly.

For Spring Boot applications, include the Actuator dependency for comprehensive health endpoints, as shown in the following example:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure your application to output logs in a format suitable for container environments, like JSON.

## Deploy to Azure Container Apps

This section guides you through preparing your Java containers for Azure Container Apps deployment, and highlights key configuration considerations.

### Prepare your container for Azure

- Port configuration. Ensure your container listens on the port provided by Azure, as shown in the following example:

    ```dockerfile
    FROM mcr.microsoft.com/java/jre:21-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    ENV PORT=8080
    EXPOSE ${PORT}
    CMD java -jar app.jar --server.port=${PORT}
    ```

- Probe for health. Implement [health probes](health-probes.md) for Azure's liveness and readiness checks.
- Log configuration. Configure [logging](logging.md) to output to `stdout`/`stderr`.
- Plan for the unexpected. Set up proper graceful shutdown handling with time-out configuration. For more information, see [Application lifecycle management in Azure Container Apps](./application-lifecycle-management.md).

## Related content

- [Java on Container Apps overview](./java-overview.md)
