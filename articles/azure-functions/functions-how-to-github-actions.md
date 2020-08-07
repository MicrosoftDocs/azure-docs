---
title: Use GitHub Actions to make code updates in Azure Functions
description: Learn how to use GitHub Actions to define a workflow to build and deploy Azure Functions projects in GitHub.
author: craigshoemaker
ms.topic: conceptual
ms.date: 04/16/2020
ms.author: cshoe
ms.custom: tracking-python
---

# Continuous delivery by using GitHub Action

[GitHub Actions](https://github.com/features/actions) lets you define a workflow to automatically build and deploy your functions code to function app in Azure. 

In GitHub Actions, a [workflow](https://help.github.com/articles/about-github-actions#workflow) is an automated process that you define in your GitHub repository. This process tells GitHub how to build and deploy your functions app project on GitHub. 

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow. 

For an Azure Functions workflow, the file has three sections: 

| Section | Tasks |
| ------- | ----- |
| **Authentication** | <ol><li>Define a service principal.</li><li>Download publishing profile.</li><li>Create a GitHub secret.</li></ol>|
| **Build** | <ol><li>Set up the environment.</li><li>Build the function app.</li></ol> |
| **Deploy** | <ol><li>Deploy the function app.</li></ol>|

> [!NOTE]
> You do not need to create a service principal if you decide to use publishing profile for authentication.

## Create a service principal

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) by using the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). You can run this command using [Azure Cloud Shell](https://shell.azure.com) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Web/sites/<APP_NAME> --sdk-auth
```

In this example, replace the placeholders in the resource with your subscription ID, resource group, and function app name. The output is the role assignment credentials that provide access to your function app. Copy this JSON object, which you can use to authenticate from GitHub.

> [!IMPORTANT]
> It is always a good practice to grant minimum access. This is why the scope in the previous example is limited to the specific function app and not the entire resource group.

## Download the publishing profile

To download the publishing profile of your function app:

1. Select the function app's **Overview** page, and then select **Get publish profile**.

   :::image type="content" source="media/functions-how-to-github-actions/get-publish-profile.png" alt-text="Download publish profile":::

1. Save and copy the contents of the publish settings file.

## Configure the GitHub secret

1. In [GitHub](https://github.com), browse to your repository, select **Settings** > **Secrets** > **Add a new secret**.

   :::image type="content" source="media/functions-how-to-github-actions/add-secret.png" alt-text="Add Secret":::

1. Add a new secret.

   * If you're using the service principal that you created by using the Azure CLI, use `AZURE_CREDENTIALS` for the **Name**. Then, paste the copied JSON object output for **Value**, and select **Add secret**.
   * If you're using a publishing profile, use `SCM_CREDENTIALS` for the **Name**. Then, use the publishing profile's file content for **Value**, and select **Add secret**.

GitHub can now authenticate to your function app in Azure.

## Set up the environment 

Setting up the environment is done using a language-specific publish setup action.

# [JavaScript](#tab/javascript)

The following example shows the part of the workflow that uses the `actions/setup-node` action to set up the environment:

```yaml
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Setup Node 10.x
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
```

# [Python](#tab/python)

The following example shows the part of the workflow that uses the `actions/setup-python` action to set up the environment:

```yaml
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Setup Python 3.6
      uses: actions/setup-python@v1
      with:
        python-version: 3.6
```

# [C#](#tab/csharp)

The following example shows the part of the workflow that uses the `actions/setup-dotnet` action to set up the environment:

```yaml
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Setup Dotnet 2.2.300
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '2.2.300'
```

# [Java](#tab/java)

The following example shows the part of the workflow that uses the  `actions/setup-java` action to set up the environment:

```yaml
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Setup Java 1.8.x
      uses: actions/setup-java@v1
      with:
        # If your pom.xml <maven.compiler.source> version is not in 1.8.x
        # Please change the Java version to match the version in pom.xml <maven.compiler.source>
        java-version: '1.8.x'
```
---

## Build the function app

This depends on the language and for languages supported by Azure Functions, this section should be the standard build steps of each language.

The following example shows the part of the workflow that builds the function app, which is language specific:

# [JavaScript](#tab/javascript)

```yaml
    - name: 'Run npm'
      shell: bash
      run: |
        # If your function app project is not located in your repository's root
        # Please change your directory for npm in pushd
        pushd .
        npm install
        npm run build --if-present
        npm run test --if-present
        popd
```

# [Python](#tab/python)

```yaml
    - name: 'Run pip'
      shell: bash
      run: |
        # If your function app project is not located in your repository's root
        # Please change your directory for pip in pushd
        pushd .
        python -m pip install --upgrade pip
        pip install -r requirements.txt --target=".python_packages/lib/python3.6/site-packages"
        popd
```

# [C#](#tab/csharp)

```yaml
    - name: 'Run dotnet build'
      shell: bash
      run: |
        # If your function app project is not located in your repository's root
        # Please consider using pushd to change your path
        pushd .
        dotnet build --configuration Release --output ./output
        popd
```

# [Java](#tab/java)

```yaml
    - name: 'Run mvn'
      shell: bash
      run: |
        # If your function app project is not located in your repository's root
        # Please change your directory for maven build in pushd
        pushd . ./POM_ARTIFACT_ID
        mvn clean package
        mvn azure-functions:package
        popd
```
---

## Deploy the function app

To deploy your code to a function app, you will need to use the `Azure/functions-action` action. This action has two parameters:

|Parameter |Explanation  |
|---------|---------|
|**_app-name_** | (Mandatory) The name of your function app. |
|_**slot-name**_ | (Optional) The name of the [deployment slot](functions-deployment-slots.md) you want to deploy to. The slot must already be defined in your function app. |


The following example uses version 1 of the `functions-action`:

```yaml
    - name: 'Run Azure Functions Action'
      uses: Azure/functions-action@v1
      id: fa
      with:
        app-name: PLEASE_REPLACE_THIS_WITH_YOUR_FUNCTION_APP_NAME
```

## Next steps

To view a complete workflow .yaml file, see one of the files in the [Azure GitHub Actions workflow samples repo](https://aka.ms/functions-actions-samples) that have `functionapp` in the name. You can use these samples a starting point for your workflow.

> [!div class="nextstepaction"]
> [Learn more about GitHub Actions](https://help.github.com/en/articles/about-github-actions)
