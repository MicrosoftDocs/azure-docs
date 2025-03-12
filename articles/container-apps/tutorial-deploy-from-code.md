---
title: "Tutorial: Build and deploy from source code to Azure Container Apps"
description: Build and deploy your source code to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 02/05/2025
ms.author: cshoe
#customer intent: I want to deploy and update a container app from source code on my machine.
---

# Tutorial: Build and deploy from source code to Azure Container Apps

This article shows you how to build and deploy an application to Azure Container Apps from source code on your machine in your preferred programming language.

In this tutorial you:

> [!div class="checklist"]
> * Create a simple web application.
> * Create an associated Dockerfile for your app.
> * Create an image from the compiled code and push it to a container registry.
> * Use managed identity to securely access your container registry.
> * Deploy your container to Azure Container Apps.
> * View your app in a browser to verify deployment.

## Prerequisites

To complete this project, you need the following items:

| Requirement | Instructions |
|--|--|
| [Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| [Azure CLI](/cli/azure/install-azure-cli) | Install the [Azure CLI](/cli/azure/install-azure-cli) or upgrade to the latest version. The Azure Developer CLI (`azd` commands) is available through the Azure CLI. |

Depending on your choice of language, you also might need to install the appropriate runtime, SDK, and other dependencies.

# [C#](#tab/csharp)

Install the [.NET SDK](https://dotnet.microsoft.com/download).

# [Java](#tab/java)

* Install the [Java Development Kit](https://www.oracle.com/java/technologies/downloads/).

* Install [Apache Maven](https://maven.apache.org/install.html).

# [JavaScript](#tab/javascript)

Install [Node.js](https://nodejs.org/).

# [Python](#tab/python)

Install [Python](https://www.python.org/downloads/).

---

## Create the local application

The following steps show the code and dependencies required to build a sample application to deploy on Azure Container Apps.

> [!NOTE]
> If you would like to use another language other than the ones listed, enter the following prompt into your preferred AI model.
>
> Before you submit the prompt, replace `<LANGUAGE>` with your language of choice.
>
>    ```text
>    Generate the simplest possible "hello world" web server in idiomatic <LANGUAGE>.
>    
>    Make sure to include any dependencies required for the application to run locally and in production. 
>    ```

1. Create and run your source code.

    # [C#](#tab/csharp)

    Create a new C# project.

    ```command
    dotnet new webapp --name MyAcaDemo --language C#
    ```

    Change into the **MyAcaDemo** folder.

    ```command
    cd MyAcaDemo
    ```

    Open `Program.cs` in a code editor and replace the contents with the following code.

    ```csharp
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }
    
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls("http://*:8080");
                });
    }
    ```

    Implementing the `Program` class with this code creates the basis of a web application. Next, create a class responsible for returning a web page as a response.

    In the same folder, create a new file named `Startup.cs` and enter the following code.

    ```csharp
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }
    
        public void Configure(IApplicationBuilder app)
        {   
            app.UseRouting();
    
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }
    }
    ```

    Now when a request is made to your web application, the text "Hello World!" is returned. To verify your code is running correctly on your local machine, build your project in release configuration.

    ```command
    dotnet build -c Release
    ```

    Next, run your application to verify your code is implemented correctly.

    ```command
    dotnet run --configuration Release
    ```

    # [Java](#tab/java)

    Create a new Java application by first fetching the Spring Boot starter application using the following command.

    ```bash
    curl https://start.spring.io/starter.zip -d dependencies=web -d name=MyAcaDemo -d artifactId=MyAcaDemo -d baseDir=MyAcaDemo -o MyAcaDemo.zip
    ```

    If you don't have the `unzip` command installed, you can install it now.

    ```bash
    sudo apt-get update && sudo apt-get install unzip
    ```

    Now you can unzip the package to a folder named **MyAcaDemo**.

    ```bash
    unzip MyAcaDemo.zip -d MyAcaDemo
    ```

    As you unzip this package, it creates a nested folder structure where a folder named *MyAcaDemo* lives inside an outer folder named *MyAcaDemo*.

    Use the following command to change into the correct *MyAcaDemo* folder.

    ```bash
    cd MyAcaDemo/MyAcaDemo
    ```

    Open this folder in a code editor so you can add and edit some files.

    In the `src/main/java/com/example/MyAcaDemo/` folder, create a file named `MyAcaDemoController.java` and enter the following code.

    ```java
    package com.example.MyAcaDemo;
    
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;
    
    @RestController
    public class MyAcaDemoController {
        @GetMapping("/")
        public String hello() {
            return "Hello, World!";
        }
    }
    ```

    In the *MyAcaDemo* folder, create a file named `pom.xml` and add the following code.

    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.example</groupId>
        <artifactId>MyAcaDemo</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <name>MyAcaDemo</name>
        <description>Demo project for Spring Boot</description>
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>3.1.0</version>
            <relativePath/> <!-- lookup parent from repository -->
        </parent>
        <properties>
            <java.version>17</java.version>
        </properties>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <scope>test</scope>
            </dependency>
        </dependencies>
        <build>
            <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>com.example.MyAcaDemo.MyAcaDemoApplication</mainClass>
                </configuration>
            </plugin>
            </plugins>
        </build>
    </project>
    ```

    Run the following command to verify your project builds without errors.

    ```bash
    mvn clean package -DskipTests
    ```

    Once you have a successful build, run the following command to ensure the application runs correctly on your machine.

    ```bash
    mvn spring-boot:run
    ```

    # [JavaScript](#tab/javascript)

    Create a folder named **MyAcaDemo** to hold the files for the demo application.

    ```bash
    mkdir MyAcaDemo
    ```

    Next, change into the **MyAcaDemo** folder.

    ```bash
    cd MyAcaDemo
    ```

    Use the following command to generate the basic files for a Node.js application.

    ```bash
    npm init -y
    ```

    Open this folder in a code editor and create a file named `index.js` with the following code.

    ```javascript
    const http = require('http');
    
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html>Hello World!</html>');
    });
    
    server.listen(8080, () => {
        console.log('Server running at http://localhost:8080/');
    });
    ```

    Now you can run the following command to ensure the application runs correctly on your machine.

    ```bash
    node index.js
    ```

    # [Python](#tab/python)

    Create a folder named **MyAcaDemo**.

    ```bash
    mkdir MyAcaDemo
    ```

    Change into the **MyAcaDemo** folder.

    ```bash
    cd MyAcaDemo
    ```

    Install the Flask using the following command.

    ```bash
    pip install flask
    ```

    The sample application is based on the Flask framework. You need it installed locally so you can verify your app runs correctly on your machine before you try to deploy it to the cloud.

    Create a new file named `app.py` and enter the following code.

    ```python
    from flask import Flask
    
    app = Flask(__name__)
    
    @app.route('/')
    def hello_world():
        return '<html>Hello World!</html>'
    
    if __name__ == '__main__':
        app.run()
    ```

    This code creates a basic web server that returns *Hello World!*.

    In the same folder, create a new file named `requirements.txt` and enter the following code.

    ```text
    Flask
    gunicorn
    ```

    This file instructs the Python runtime to use the *Flask* web framework and *gunicorn* web server to host the sample application.

    Run the following command to verify the application is working correctly.

    ```bash
    python3 app.py
    ```

    ---

    Once you verify the application works as expected, you can stop the local server and move on to creating a Dockerfile so you can deploy the app to Container Apps.

1. In the *MyAcaDemo* folder, create a file named `Dockerfile` and add the following contents.

    # [C#](#tab/csharp)

    ```dockerfile
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /src
    COPY . .
    RUN dotnet publish -c Release -o /app/publish
    
    FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
    WORKDIR /app
    COPY --from=build /app/publish .
    EXPOSE 8080
    ENTRYPOINT ["dotnet", "MyAcaDemo.dll"]
    ```

    # [Java](#tab/java)

    ```dockerfile
    FROM maven:3.8.4-openjdk-17 AS build
    WORKDIR /app
    COPY pom.xml .
    COPY src ./src
    RUN mvn clean package -DskipTests
    
    FROM openjdk:17-jdk-alpine
    WORKDIR /app
    COPY --from=build /app/target/MyAcaDemo-0.0.1-SNAPSHOT.jar /app/MyAcaDemo.jar
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "MyAcaDemo.jar"]
    ```

    # [JavaScript](#tab/javascript)

    ```dockerfile
    FROM node:18
    WORKDIR /usr/src/app
    COPY ./ . 
    RUN npm install
    EXPOSE 3000
    CMD ["node", "index.js"]
    ```

    # [Python](#tab/python)

    ```dockerfile
    FROM python:3.9-slim
    WORKDIR /app
    COPY . /app
    RUN pip install --no-cache-dir -r requirements.txt
    EXPOSE 8080
    ENV FLASK_APP=app.py
    CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
    ```

    ---

    Now that you have your code and a Dockerfile ready, you can deploy your app to Azure Container Apps.

## Create Azure resources

1. Sign in to Azure from the CLI with the following command. To complete the authentication process, make sure to follow all the prompts.

    ```azurecli
    az login
    ```

1. Install or update the Azure Container Apps extension for the Azure CLI.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

    > [!NOTE]
    > If you receive errors about missing parameters when you run `az containerapp` commands, be sure you have the latest version of the Azure Container Apps extension installed.

1. Now that your Azure CLI setup is complete, you can define a set of environment variables.

    Before you run the following command, review the provided values.

    The location is configured as *Central US*, but you can change to a location nearest you if you prefer.

    ```azurecli
    LOCATION="CentralUS"
    RESOURCE_GROUP="my-demo-group"
    IDENTITY_NAME="my-demo-identity"
    ENVIRONMENT="my-demo-environment"
    REGISTRY_NAME="mydemoregistry$(openssl rand -hex 4)"
    CONTAINER_APP_NAME="my-demo-app"
    ```

    The `mydemoregistry$(openssl rand -hex 4)` command generates a random string to use as your container registry name. Registry names must be globally unique, so this string helps ensure your commands run successfully.

1. Create a resource group to organize the services related to your container app deployment.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --output none
    ```

1. Create a [user-assigned managed identity](./managed-identity.md) and get its ID with the following commands.

    First, create the managed identity.

    ```azurecli
    az identity create \
        --name $IDENTITY_NAME \
        --resource-group $RESOURCE_GROUP \
        --output none
    ```

    Now set the identity identifier into a variable for later use.

    ```bash
    IDENTITY_ID=$(az identity show \
      --name $IDENTITY_NAME \
      --resource-group $RESOURCE_GROUP \
      --query id \
      --output tsv)
    ```

1. Create a Container Apps environment to host your app using the following command.

    ```azurecli
    az containerapp env create \
        --name $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --mi-user-assigned $IDENTITY_ID \
        --output none
    ```

1. Create an Azure Container Registry (ACR) instance in your resource group. The registry stores your container image.

    ```azurecli
    az acr create \
      --resource-group $RESOURCE_GROUP \
      --name $REGISTRY_NAME \
      --sku Basic \
      --output none
    ```

1. Assign your user-assigned managed identity to your container registry instance with the following command.

    ```azurecli
    az acr identity assign \
      --identities $IDENTITY_ID \
      --name $REGISTRY_NAME \
      --resource-group $RESOURCE_GROUP \
      --output none
    ```

## Build and push the image to a registry

Build and push your container image to your container registry instance with the following command.

```azurecli
az acr build \
    -t $REGISTRY_NAME".azurecr.io/"$CONTAINER_APP_NAME":helloworld" \
    -r $REGISTRY_NAME .
```

This command applies the tag `helloworld` to your container image.

## Create your container app

Create your container app with the following command.

```azurecli
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $REGISTRY_NAME".azurecr.io/"$CONTAINER_APP_NAME":helloworld" \
  --target-port 8080 \
  --ingress external \
  --user-assigned $IDENTITY_ID \
  --registry-identity $IDENTITY_ID \
  --registry-server $REGISTRY_NAME.azurecr.io \
  --query properties.configuration.ingress.fqdn
```

This command adds the `acrPull` role to your user-assigned managed identity, so it can pull images from your container registry.

The following table describes the parameters used by this command.

| Parameter | Value | Description |
|--|--|--|
| `name` | `$CONTAINER_APP_NAME` | The name of your container app. |
| `resource-group` | `$RESOURCE_GROUP` | The resource group in which your container app is deployed. |
| `environment` | `$ENVIRONMENT` | The environment in which your container app runs. |
| `image` | `$REGISTRY_NAME".azurecr.io/"$CONTAINER_APP_NAME":helloworld"` | The container image to deploy, including the registry name and tag. |
| `target-port` | `80` | Matches the port that your app is listening to for requests. |
| `ingress` | `external` | Makes your container app accessible from the public internet. |
| `user-assigned` | `$IDENTITY_ID` | The user-assigned managed identity for your container app. |
| `registry-identity` | `registry-identity` | The identity used to access the container registry. |
| `registry-server` | `$REGISTRY_NAME.azurecr.io` | The server address of your container registry. |
| `query` | `properties.configuration.ingress.fqdn` | Filters the output to just the app's fully qualified domain name (FQDN). |

Once this command completes, it returns URL for your new web app.

## Verify deployment

Copy the app's URL into a web browser. Once the container app is started, it returns *Hello World!*.

Since this is the first time the application is accessed, it may take a few moments for the app to return a response.

## Clean up resources

If you're not going to use the Azure resources created in this tutorial, you can remove them with a single command. Before you run the command, there's a next step in this tutorial series that shows you how to [make changes to your code and update your app in Azure](./tutorial-update-from-code.md).

If you're done and want to remove all Azure resources created in this tutorial, delete the resource group with the following command.

```azurecli
az group delete --name aca-demo
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

Next, continue on to learn how to update the container app you created.

> [!div class="nextstepaction"]
> [Update a container app deployed from source code](tutorial-update-from-code.md)
