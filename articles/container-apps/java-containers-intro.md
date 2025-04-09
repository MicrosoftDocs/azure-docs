---
title: Introduction to containers for Java applications
description: Learn the basics of using containers for Java applications.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/09/2025
ms.author: cshoe
ai-usage: ai-generated
---

# Introduction to containers for Java applications

Containers provide a consistent, portable environment for your Java applications across development, testing, and production stages. This article introduces containerization concepts for Java applications and guides you through creating, debugging, optimizing, and deploying containerized Java applications to Azure Container Apps.

In this article, you learn:

- Essential containerization concepts for Java developers
- Setting up your development environment for containerized Java applications
- Creating Dockerfiles optimized for Java workloads
- Configuring local development workflows with containers
- Debugging containerized Java applications
- Optimizing Java containers for production
- Deploying your containerized Java applications to Azure Container Apps

By containerizing your Java applications, you get consistent environments, simplified deployment, efficient resource utilization, and improved scalability.

## Containers for Java applications

Containers package applications with their dependencies, ensuring consistency across environments. For Java developers, this means bundling the application, its dependencies, JRE/JDK, and configuration files into a single, portable unit.

Containerization has key advantages over virtualization that make them ideal for cloud development. In contrast to a virtual machine, a container runs on a server's host OS kernel. This is beneficial for Java applications which already run in a virtual machine (JVM). Containerizing Java applications adds minimal overhead while providing significant deployment benefits.

The container ecosystem includes several key components:

- images (the blueprints)
- containers (running instances)
- registries (where images are stored)
- orchestrators (systems that manage containers at scale)

Docker is the most popular containerization platform, and is well-supported in the Azure ecosystem through Azure Container Apps.

## Set up your development environment

This section guides you through installing the necessary tools and configuring your development environment to build, run, and debug containerized Java applications.

### Install required tools

To containerize Java applications, you need several tools installed on your development machine:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Provides the Docker engine, CLI, and Docker Compose for Windows or macOS.

1. **[Visual Studio Code](https://code.visualstudio.com/download)**: Available as a free code editor.

1. **Visual Studio Code extensions**:
    - [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for managing containers
    - [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) for Java development
    - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for developing inside containers.

After installing Docker Desktop, you can verify your installation with the following commands:

```bash
docker --version
docker-compose --version
```

### Configure Visual Studio Code for container development

For Java development in containers, configure Visual Studio Code by installing the Java Extension Pack and setting up your Java development kit. The *Dev Containers* extension enables you to open any folder inside a container and use Visual Studio Code's full feature set while inside that container.

Creating a `.devcontainer/devcontainer.json` file in your project allows Visual Studio Code to automatically build and connect to a development container.

For instance, the following example configuration defines a Java build:

```json
{
    "name": "Java Development",
    "image": "mcr.microsoft.com/devcontainers/java:11",
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

This configuration uses Microsoft's Java development container image, adds essential extensions, and forwards both the application port (`8080`) and debugging port (`5005`).

## Create a Dockerfile

A Dockerfile contains instructions for building a Docker image. For Java applications, the Dockerfile typically includes:

1. A base image with the Java Development Kit (JDK) or Java Runtime Environment (JRE)
1. Instructions to copy application files
1. Setting environment variables
1. Configuring entry points

### Select a base image

Choosing the right base image is crucial. Consider these options:

| Description | Name | Remarks |
|---|---|---|
| **Microsoft Java development Image** | `mcr.microsoft.com/java/jdk:11-zulu-ubuntu` | Full Java development kit (JDK) and optimized for Azure |
| **Microsoft Java production Image** | `mcr.microsoft.com/java/jre:11-zulu-ubuntu` | Runtime only and optimized for Azure |
| **Official OpenJDK development Image** | `openjdk:11-jdk` | Full JDK |
| **Official OpenJDK production Image** | `openjdk:11-jre` | Runtime only |

For development environments, use a full JDK image. For production, use JRE or distroless images to minimize size and attack surface of your application.

The Microsoft Java images come with Azure-specific optimizations and are regularly updated with security patches, making them ideal for applications targeting Azure Container Apps.

### Basic Dockerfile examples

The following example shows a simple Dockerfile for a Java application:

```dockerfile
FROM mcr.microsoft.com/java/jdk:11-zulu-ubuntu
WORKDIR /app
COPY target/myapp.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

For Spring Boot applications, you can setup your Dockerfile with the following base:

```dockerfile
FROM mcr.microsoft.com/java/jdk:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]
```

For production deployments, use the JRE image to reduce the size and minimize the attack surface of your application:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Dserver.port=8080"
ENTRYPOINT ["java", ${JAVA_OPTS}, "-jar", "app.jar"]
```

## Local development with containers

Containers are meant to execute in various contexts. In this section, you learn a local development flow while using containers.

### Use Docker Compose for multi-container applications

Most Java applications interact with databases, caches, or other services.

Docker Compose helps you define and manage multi-container Docker applications. It allows you to configure your application's services, networks, and volumes using a simple YAML file named `docker-compose.yml`. With Docker Compose, you can start, stop, and manage all the containers in your application as a single unit.

The following example demonstrates how to configure Docker Compose to prepare a database connection to your application.

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
      - "5005:5005"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp
    volumes:
      - ./target:/app/target
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

This configuration creates two containers: one for the Java application and one for a PostgreSQL database. It also sets up networking between them, mounts volumes for persistence, and exposes necessary ports.

## Debugging containerized applications

Debugging containerized Java applications is sometimes challenging because your code runs in an isolated environment inside the container.

Standard debugging approaches don't always directly apply, but with the right configuration, you can establish a remote debugging connection to your application. This section shows you how to configure your containers for debugging, connect your development tools to running containers, and troubleshoot common container-related issues.

### Set up remote debugging

Debugging containerized Java applications requires exposing a debug port and configuring your IDE to connect to it:

1. To enable debugging, modify your Dockerfile or container startup command:

    ```dockerfile
    FROM mcr.microsoft.com/java/jdk:11-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    EXPOSE 8080 5005
    ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
    ```

1. Configure Visual Studio Code's `launch.json` to connect to the debug port:

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

1. Start your container with port `5005` mapped to your host, then launch the debugger in Visual Studio Code.

### Troubleshoot container issues

When containers don't behave as expected, you can inspect your app's logs to investigate the issue.

You can use the following commands to troubleshoot your application.

Before you run these commands, make sure to replace the placeholders surrounded by `<>` with your own values.

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

For Java-specific issues, enable JVM flags for better diagnostics:

```dockerfile
ENTRYPOINT ["java", "-XX:+PrintFlagsFinal", "-XX:+PrintGCDetails", "-jar", "app.jar"]
```

Common issues include:

| Error | Possible solution |
|---|---|
| Out of memory | Increase container memory limits |
| Connection time-outs | Check network configuration for errors. Verify ports and routing rules. |
| Permission problems | Verify file system permissions. |
| Classpath issues | Check JAR structure and dependencies. |

## Optimize Java containers

Java applications in containers require special consideration for optimal performance. The JVM was designed before containers were common, which can lead to resource allocation issues if not properly configured.

By fine-tuning memory settings, optimizing image size, and configuring garbage collection, you can significantly improve the performance and efficiency of your containerized Java applications. This section covers essential optimizations for Java containers with a focus on memory management, startup time, and resource utilization.

### JVM memory configuration in containers

The JVM doesn't automatically detect container memory limits in Java 8. For Java 9+, container awareness is enabled by default.

Configure your JVM to respect container limits:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

Key JVM flags for containerized applications:

- `-XX:+UseContainerSupport`: Makes JVM container-aware (default in Java 10+)
- `-XX:MaxRAMPercentage=75.0`: Sets maximum heap as a percentage of available memory
- `-XX:InitialRAMPercentage=50.0`: Sets initial heap size
- `-Xmx` and `-Xms`: Are also available, but requires fixed values

## Prepare for production deployment

Moving containerized Java applications to production requires additional considerations beyond basic functionality.

Production environments demand robust security, reliable monitoring, proper resource allocation, and configuration flexibility.

This section covers the essential practices and configurations needed to prepare your Java containers for production use, with a focus on security, health checks, and configuration management to ensure your applications run reliably in production.

### Security best practices

Secure your containerized Java applications with these practices:

- **Default security context**: Run your application as a non-root user:

    ```dockerfile
    FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
    USER javauser
    ENTRYPOINT ["java", "-jar", "app.jar"]
    ```

- **Proactively look for issues**: Regularly scan container images for vulnerabilities:

    ```bash
    docker scan myapp:latest
    ```

- **Base image freshness**: Keep your base images up-to-date.

- **Secrets management**: Implement proper secrets management. For instance, don't hardcode sensitive data into your application and use a Key Vault whenever possible.

- **Restricted security contexts**: Apply the principle of least privilege to all security contexts.

- **File system access**: Use read-only file systems wherever possible.

### Health checks and monitoring

Check application health with [probes](health-probes.md) to ensure your application is running correctly.

For Spring Boot applications, include the Actuator dependency for comprehensive health endpoints:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure your application to output logs in a format (like JSON) suitable for container environments.

## Deploy to Azure Container Apps

This section guides you through preparing your Java containers for Azure Container Apps deployment and highlights key configuration considerations.

### Prepare your container for Azure

- **Port configuration**: Ensure your container listens on the port provided by Azure:

    ```dockerfile
    FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
    WORKDIR /app
    COPY target/*.jar app.jar
    ENV PORT=8080
    EXPOSE ${PORT}
    CMD java -jar app.jar --server.port=${PORT}
    ```

- **Probe for health**: Implement [health probes](health-probes.md) for Azure's liveness and readiness checks

- **Log configuration**: Configure logging to output to `stdout`/`stderr`.

- **Plan for the unexpected**: Set up proper graceful shutdown handling with time out configuration

## Related content

- [Java on Container Apps overview](./java-overview.md)
