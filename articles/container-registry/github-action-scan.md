---
title: Scan container images using GitHub Actions
description: Learn how to scan the container images using Container Scan action
ms.topic: quickstart
ms.reviewer: jukullam
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: github-actions-azure, mode-other
---

# Scan container images using GitHub Actions

Get started with the [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) by creating a workflow to build and scan a container image.

With GitHub Actions, you can speed up your CI/CD process by building, scanning, and pushing images to a public or private [Container Registry](https://azure.microsoft.com/services/container-registry/) from your workflows.

In this article, we'll make use of the [Container image scan](https://github.com/marketplace/actions/test-container-image-scan) from the [GitHub Marketplace](https://github.com/marketplace).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Container Registry to store all the container images that are built and pushed. You can [create an Azure Container Registry from the Azure portal](../container-registry/container-registry-get-started-portal.md).
- A GitHub account with an active repository. If you don't have one, sign up for [free](https://github.com/join). 
    - This example uses the [Java Spring PetClinic Sample Application](https://github.com/spring-projects/spring-petclinic).

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Create a Container Registry on Azure. <br /> 2. Create a GitHub secret. <br /> 3. Log in to the registry using GH actions. |
|**Build** | 1. Set up the environment. <br /> 2. Build the app. |
|**Build, Scan & Push the Image to the container registry** | 1. Build the image. <br /> 2. Scan the image. <br /> 3. Push the image.|

## Create GitHub secrets

To use [Azure Container Registry Login action](https://github.com/marketplace/actions/azure-container-registry-login), you first need to add your Container Registry details as a secret to your GitHub repository.

In this example, you'll create a three secrets that you can use to authenticate with Azure.  

1. Open your GitHub repository and go to **Settings**.

    :::image type="content" source="media/github-action-scan/github-repo-settings.png" alt-text="Select Settings in the navigation.":::

1. Select **Security > Secrets and variables > Actions**. 

1. Select **New repository secret**.

1. Paste the following values for each secret created with the following values from the Azure portal by navigating to the **Access Keys** in the Container Registry. 

    | GitHub Secret Name | Azure Container Registry values |
    |---------|---------|
    |`ACR_LOGIN_SERVER` | **Login server** |
    |`REGISTRY_USERNAME` | **Username** |
    |`REGISTRY_PASSWORD` | **password** |
    
1. Save by selecting **Add secret**.

## Add a Dockerfile

Use the following snippet to create a `Dockerfile` and commit it to the repository.

```
FROM openjdk:11-jre-stretch
ADD target/spring-petclinic-2.4.2.jar spring-petclinic-2.4.2.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "spring-petclinic-2.4.2.jar" ]
```


## Use the Docker Login action

Use your secret with the [Azure Container Registry Login action](https://github.com/marketplace/actions/azure-container-registry-login) to authenticate to Azure.

In this workflow, you authenticate using the Azure Container Registry Login with the **login server**, **username, and **password** details of the registry stored in `secrets.ACR_LOGIN_SERVER`, `secrets.REGISTRY_USERNAME` and `secrets.REGISTRY_PASSWORD` respectively in the [docker-login action](https://github.com/Azure/docker-login). For more information about referencing GitHub secrets in a workflow file, see [Using encrypted secrets in a workflow](https://docs.github.com/en/actions/reference/encrypted-secrets#using-encrypted-secrets-in-a-workflow) in GitHub Docs.


```yaml
on: [push]

name: Container Scan

jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
    - name: Login to the Container Registry  
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.ACR_LOGIN_SERVER }}
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
```

## Configure Java

Set up the Java environment with the [Java Setup SDK action](https://github.com/marketplace/actions/setup-java-jdk). For this example, you'll set up the environment, build with Maven, and then build, scan and push the image to the container registry.

[GitHub artifacts](https://docs.github.com/en/actions/guides/storing-workflow-data-as-artifacts) are a way to share files in a workflow between jobs. 

```yaml
on: [push]

name: Container Scan

jobs:
  build-image:
    runs-on: ubuntu-latest    
    steps:
    - name: Checkout
      uses: actions/checkout@v2    

    - name: Login to the Container Registry  
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.ACR_LOGIN_SERVER }}
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}

    - name: Setup Java 1.8.x
      uses: actions/setup-java@v1
      with:
        java-version: '1.8.x'
        
    - name: Build with Maven
      run: mvn package --file pom.xml
```

## Build your image 

Build and tag the image using the following snippet in the workflow. The following code snippet uses the Docker CLI to build and tag the image within a shell terminal. 

```yaml
    - name: Build and Tag image
      run: |
        docker build -f ./Dockerfile -t ${{ secrets.ACR_LOGIN_SERVER }}/spring-petclinic:${{ github.run_number }} .
        
```

## Scan the image

Before pushing the built image into the container registry, make sure you scan and check the image for any vulnerabilities by using the [Container image scan action](https://github.com/marketplace/actions/test-container-image-scan).

Add the following code snippet into the workflow, which will scan the image for any ***critical vulnerabilities*** such that the image that will be pushed is secure and complies with the standards.

You can also add other inputs with this action or add an `allowedlist.yaml` file to your repository to ignore any vulnerabilities and best practice checks. 

```yaml
    - name: Scan image
      uses: Azure/container-scan@v0
      with:
        image-name: ${{ secrets.ACR_LOGIN_SERVER }}/spring-petclinic:${{ github.run_number }}
        severity-threshold: CRITICAL
        run-quality-checks: true        
```

Example `allowedlist.yaml`.

```yaml
general:
  vulnerabilities:
    - CVE-2003-1307
    - CVE-2011-3374
  bestPracticeViolations:
    - CIS-DI-0005
```
## Push the image to a private registry

Once the image is scanned and there are no vulnerabilities found, it's safe to push the built image to private registry. The following code snippet uses the Docker CLI in a shell terminal to push the image.

```yaml
    - name: Push image
      run: |
        docker push ${{ secrets.ACR_LOGIN_SERVER }}/spring-petclinic:${{ github.run_number }}
        
```
## Next steps
- Learn how to [Deploy to Azure Container Instances from Azure Container Registry](../container-instances/container-instances-using-azure-container-registry.md).
