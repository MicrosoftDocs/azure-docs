---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 01/16/2025
---

To deploy with OpenID Connect by using the managed identity you configured, use the `azure/login@v2` action with the `client-id`, `tenant-id`, and `subscription-id` keys. Reference the GitHub secrets that you created earlier.

# [ASP.NET Core](#tab/aspnetcore)

```yaml
name: .NET Core

on: [push]

permissions:
      id-token: write
      contents: read

env:
  AZURE_WEBAPP_NAME: my-app    # Set this to your application's name
  AZURE_WEBAPP_PACKAGE_PATH: '.'      # Set this to the path to your web app project, defaults to the repository root
  DOTNET_VERSION: '6.0.x'           # Set this to the dot net version to use

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Check out the repo
      - uses: actions/checkout@main
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      
      # Setup .NET Core SDK
      - name: Setup .NET Core
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }} 
      
      # Run dotnet build and publish
      - name: dotnet build and publish
        run: |
          dotnet restore
          dotnet build --configuration Release
          dotnet publish -c Release --property:PublishDir='${{ env.AZURE_WEBAPP_PACKAGE_PATH }}/myapp' 
          
      # Deploy to Azure Web apps
      - name: 'Run Azure webapp deploy action using publish profile credentials'
        uses: azure/webapps-deploy@v3
        with: 
          app-name: ${{ env.AZURE_WEBAPP_NAME }} # Replace with your app name
          package: '${{ env.AZURE_WEBAPP_PACKAGE_PATH }}/myapp'
      
      - name: logout
        run: |
          az logout
```

# [ASP.NET](#tab/aspnet)

Build and deploy an ASP.NET model-view-controller (MVC) app to Azure by using an Azure service principal. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the sign-in action.

```yaml
name: Deploy ASP.NET MVC App deploy to Azure Web App

on: [push]

permissions:
      id-token: write
      contents: read

env:
  AZURE_WEBAPP_NAME: my-app    # Set this to your application's name
  AZURE_WEBAPP_PACKAGE_PATH: '.'      # Set this to the path to your web app project, defaults to the repository root
  NUGET_VERSION: '5.3.x'           # Set this to the dot net version to use

jobs:
  build-and-deploy:
    runs-on: windows-latest
    steps:

    # Check out the repo
    - uses: actions/checkout@main
    
    - uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

    - name: Install Nuget
      uses: nuget/setup-nuget@v1
      with:
        nuget-version: ${{ env.NUGET_VERSION}}
    - name: NuGet to restore dependencies as well as project-specific tools that are specified in the project file
      run: nuget restore
  
    - name: Add msbuild to PATH
      uses: microsoft/setup-msbuild@v1.0.2

    - name: Run MSBuild
      run: msbuild .\SampleWebApplication.sln
       
    - name: 'Run Azure webapp deploy action using publish profile credentials'
      uses: azure/webapps-deploy@v3
      with: 
        app-name: ${{ env.AZURE_WEBAPP_NAME }} # Replace with your app name
        package: '${{ env.AZURE_WEBAPP_PACKAGE_PATH }}/SampleWebApplication/'
  
    # Azure logout 
    - name: logout
      run: |
        az logout
```

# [Java SE](#tab/java)

Build and deploy a Java Spring Boot app to Azure by using an Azure service principal. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the sign-in action.

```yaml
name: Java CI with Maven

on: [push]

permissions:
      id-token: write
      contents: read

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    - uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    - name: Set up JDK 1.8
      uses: actions/setup-java@v3
      with:
        java-version: 1.8
    - name: Build with Maven
      run: mvn -B package --file pom.xml
      working-directory: complete
    - name: Azure WebApp
      uses: Azure/webapps-deploy@v3
      with:
        app-name: my-app-name
        package: my/target/*.jar

    # Azure logout 
    - name: logout
      run: |
        az logout
```

# [Tomcat](#tab/tomcat)

```yaml
name: Build and deploy WAR app to Azure Web App using OpenID Connect

env:
  JAVA_VERSION: '11'                  # Set this to the Java version to use
  DISTRIBUTION: microsoft             # Set this to the Java distribution
  AZURE_WEBAPP_NAME: sampleapp        # Set this to the name of your web app

on: [push]

permissions:
  id-token: write
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Java version
        uses: actions/setup-java@v3.0.0
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: ${{ env.DISTRIBUTION }}
          cache: 'maven'

      - name: Build with Maven
        run: mvn clean install

      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          package: '*.war'
```

Here's a [full example](https://github.com/Azure-Samples/onlinebookstore/blob/master/.github/workflows/azure-webapps-java-war-oidc.yml) that uses multiple jobs for build and deploy.

# [Node.js](#tab/nodejs)

```yaml
name: JavaScript CI

on: [push]

permissions:
      id-token: write
      contents: read

name: Node.js

env:
  AZURE_WEBAPP_NAME: my-app   # Set this to your application's name
  AZURE_WEBAPP_PACKAGE_PATH: 'my-app-path'      # Set this to the path to your web app project, defaults to the repository root
  NODE_VERSION: '18.x'                # Set this to the node version to use

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # Check out the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@main
   
    - uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
        
    - name: Setup Node ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: 'npm install, build, and test'
      run: |
        npm install
        npm run build --if-present
        npm run test --if-present
      working-directory:  my-app-path
               
    # Deploy web app by using Azure credentials
    - uses: azure/webapps-deploy@v3
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}

    # Azure logout 
    - name: logout
      run: |
        az logout
```

# [Python](#tab/python)

```yaml
name: Python application

on:
  [push]

permissions:
      id-token: write
      contents: read

env:
  AZURE_WEBAPP_NAME: my-app # Set this to your application's name
  AZURE_WEBAPP_PACKAGE_PATH: '.' # Set this to the path to your web app project, defaults to the repository root

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

    - name: Set up Python 3.x
      uses: actions/setup-python@v4
      with:
        python-version: 3.x
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Deploy web App using GH Action azure/webapps-deploy
      uses: azure/webapps-deploy@v3
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
    - name: logout
      run: |
        az logout
```

---
