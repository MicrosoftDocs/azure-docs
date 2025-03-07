---
title: Introduction to containers for Java applications
description: Learn the basics of using containers for Java applications.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-extended-java
ms.topic: tutorial
ms.date: 03/07/2025
ms.author: cshoe
---

# Introduction to containers for Java applications

TODO

## Understanding containers for Java applications

Containers package applications with their dependencies, ensuring consistency across environments. For Java developers, this means bundling the application, its dependencies, JRE/JDK, and configuration files into a single, portable unit. 

Containers solve the "it works on my machine" problem by providing the same runtime environment everywhere.

Containerization differs from virtualization in that containers share the host OS kernel, making them more lightweight and efficient. This approach is beneficial for Java applications, which already run in a virtual machine (JVM). Containerizing Java applications adds minimal overhead while providing significant deployment benefits.

The container ecosystem includes several key components:

- images (the blueprints)
- containers (running instances)
- registries (where images are stored)
- orchestrators (systems that manage containers at scale).

Docker is the most popular containerization platform, and is well-supported in the Azure ecosystem through Azure Container Apps.

## Set up your development environment

### Install required tools

To containerize Java applications, you need several tools installed on your development machine:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Provides the Docker engine, CLI, and Docker Compose for Windows or macOS.

1. **[Visual Studio Code](https://code.visualstudio.com/download)**: A lightweight but powerful code editor.

1. **Essential Visual Studio Code Extensions**:
    - [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for managing containers
    - [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) for Java development
    - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for developing inside containers.

After installing Docker Desktop, verify the installation with:

```bash
docker --version
docker-compose --version
```

### Configure Visual Studio Code for container development

Visual Studio Code can dramatically improve your container development experience. The Docker extension provides syntax highlighting for Dockerfiles, command completion, and an explorer interface for managing containers.

For Java development in containers, configure Visual Studio Code by installing the Java Extension Pack and setting up your Java development kit. The *Dev Containers* extension enables you to open any folder inside a container and use Visual Studio Code's full feature set while inside that container.

Creating a `.devcontainer/devcontainer.json` file in your project allows Visual Studio Code to automatically build and connect to a development container.

For instance, the following configuration defines a Java build:

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
| **Microsoft Java development Image** | `mcr.microsoft.com/java/jdk:11-zulu-ubuntu` | Full JDK and optimized for Azure |
| **Microsoft Java production Image** | `mcr.microsoft.com/java/jre:11-zulu-ubuntu` | Runtime only and optimized for Azure |
| **Official OpenJDK development Image** | `openjdk:11-jdk` | Full JDK |
| **Official OpenJDK production Image** | `openjdk:11-jre` | Runtime only |

For development environments, use a full JDK image. For production, use JRE or distroless images to minimize size and attack surface.

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

For Spring Boot applications, which are commonly used in microservices architecture, you can use setup your Dockerfile with the following base:

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

Docker Compose is a tool used to define and manage multi-container Docker applications. It allows you to configure your application's services, networks, and volumes using a simple YAML file named `docker-compose.yml`. With Docker Compose, you can start, stop, and manage all the containers in your application as a single unit.

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

This configuration creates two containers: one for your Java application and one for a PostgreSQL database. It also sets up networking between them, mounts volumes for persistence, and exposes necessary ports.

## Debugging containerized applications

TODO

### Setting Up Remote Debugging

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

### Troubleshooting Container Issues

When containers don't behave as expected, use these commands for troubleshooting:

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

| Error | Task |
|---|---|
| Out of memory | Increase container memory limits |
| Connection time-outs | Check network configuration |
| Permission problems | Verify file system permissions |
| Classpath issues | Check JAR structure and dependencies |

## Optimizing Java Containers

TODO

### JVM Memory Configuration in Containers

The JVM doesn't automatically detect container memory limits in Java 8. For Java 9+, container awareness is enabled by default. Configure your JVM to respect container limits:

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

TODO

### Security best practices

Secure your containerized Java applications with these practices:

1. Run as nonroot user:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
USER javauser
ENTRYPOINT ["java", "-jar", "app.jar"]
```

1. Scan images for vulnerabilities:

```bash
docker scan myapp:latest
```

1. Use up-to-date base images

1. Implement proper secrets management (don't hardcode sensitive data)

1. Apply the principle of least privilege

1. Use read-only file systems where possible

### Health Checks and Monitoring

Implement health checks to ensure your application is running correctly:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```

For Spring Boot applications, include the Actuator dependency for comprehensive health endpoints:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure your application to output logs in a format suitable for container environments (JSON format works well).

### Configuration management

Use environment variables for configuration rather than hardcoding values:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE="prod"
ENTRYPOINT java $JAVA_OPTS -jar app.jar
```

Pass configuration settings when running:

```bash
docker run -p 8080:8080 \
  -e "SPRING_PROFILES_ACTIVE=prod" \
  -e "DB_HOST=my-db-host" \
  myapp:latest
```

For more complex configurations, consider using Azure App Configuration or environment variable mapping in Azure Container Apps.

## Deploying to Azure Container Apps

TODO

### Preparing Your Container for Azure

1. Ensure your container listens on the port provided by Azure:

```dockerfile
FROM mcr.microsoft.com/java/jre:11-zulu-ubuntu
WORKDIR /app
COPY target/*.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
CMD java -jar app.jar --server.port=${PORT}
```

1. Implement health probes for Azure's liveness and readiness checks

1. Configure logging to output to `stdout`/`stderr`

1. Set up proper graceful shutdown handling with time out configuration

## Related content

TODO
