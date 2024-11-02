---
title: "Tutorial: Use code interpreter sessions for NodeJS code execution with Azure Container Apps"
description: Learn to use code interpreter sessions for NodeJS code execution on Azure Container Apps.
services: container-apps
author: iasthana
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 10/28/2024
ms.author: gok
---

# Tutorial: Use code interpreter sessions in AutoGen with Azure Container Apps

In this tutorial, you learn how to use a code interpreter in dynamic sessions to execute NodeJS code. You can use dynamic sessions of code-interpreter to run untrusted code


> [!NOTE]
> Azure Container Apps dynamic sessions is currently in preview. See [preview limitations](./sessions.md#preview-limitations) for more information.


## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Create Azure resources

1. Update the Azure CLI to the latest version.

```shell
az upgrade
```

1. Remove the Azure Container Apps extension if it's already installed and install a preview version the Azure Container Apps extension containing commands for sessions:

```shell
az extension remove --name containerapp
az extension add \
--name containerapp \
--allow-preview true -y
```

1. Sign in to Azure:

```shell
az login
```

1. Set the variables used in this quickstart:

```shell
$RESOURCE_GROUP_NAME=<RESOURCE_GROUP_NAME>
$SESSION_POOL_LOCATION=<SESSION_POOL_LOCATION>
$SESSION_POOL_NAME=<SESSION_POOL_NAME>
$SUBSCRIPTION_ID=<SUBSCRIPTION_GUID>
$SESSION_IDENTIFIER_STRING = <SESSION_IDENTIFIER_STRING>
$EMAIL_ID=<user@microsoft.com>
```

1. Create a resource group:

```shell
az group create --name $RESOURCE_GROUP_NAME --location $SESSION_POOL_LOCATION
```

1. Create a code interpreter session pool:

```shell
az containerapp sessionpool create \
--name $SESSION_POOL_NAME \
--resource-group $RESOURCE_GROUP_NAME \
--location $SESSION_POOL_LOCATION \
--max-sessions 100 \
--container-type NodeLTS \
--cooldown-period 300
```


## RBAC Role Assignment for Session Code Execution APIs 

The role `Azure ContainerApps Session Executor` is required to execute code in container-apps sessions.

```shell
az role assignment create \
--role "Azure ContainerApps Session Executor"\
--assignee $EMAIL_ID \
--scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME"
```

## Obtain BearerToken using the command

| Note: Use resource `https://dynamicsessions.io` for obtaining data-plane access-token. The value of `accessToken` returned from the command below should be stored as `DATAPLANE_BEARERTOKEN` to be used in api requests.

```shell
az account get-access-token \
--resource https://dynamicsessions.io
```

```shell
$DATAPLANE_BEARERTOKEN = <DATAPLANE_BEARERTOKEN>
```

## Code Samples

Below are the code examples for different use cases of NodeJS code execution in code-interpreter dynamic sessions.

1. ### Install a npm package 

Use this sample to install a npm package in your session.

| Note: You should run the code against egress enabled session pool

```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "console.time(\"time taken\");\nvar result3 = require(\"child_process\").spawnSync(\"npm\", [\"install\",\"axios\"], { encoding: \"utf-8\" });\nconsole.timeEnd(\"time taken\");\nif (result3.error) {\nconsole.error(`Error: ${result3.error.message}`);\nprocess.exit(1);\n}\nif (result3.status !== 0) {\nconsole.error(`stderr: ${result3.stderr}`);\nprocess.exit(result3.status);\n}\nconsole.log(`stdout: ${result3.stdout}`);\n",
        "timeoutInSeconds": 100
    }
}'
```


2. ### List all installed packages 

Use this sample to list all the installed packages in your session.

```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "console.time(\"time taken\");\nvar result3 = require(\"child_process\").spawnSync(\"npm\", [\"list\"], { encoding: \"utf-8\" });\nconsole.timeEnd(\"time taken\");\nif (result3.error) {\nconsole.error(`Error: ${result3.error.message}`);\nprocess.exit(1);\n}\nif (result3.status !== 0) {\nconsole.error(`stderr: ${result3.stderr}`);\nprocess.exit(result3.status);\n}\nconsole.log(`stdout: ${result3.stdout}`);\n",
        "timeoutInSeconds": 100
    }
}'
```

3. ### Validate codeType for your code

#### a. Inline
```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "console.log(\"inline-synchronous\")",
        "timeoutInSeconds": 100
    }
}'
```

#### b. InlineText

```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "inlinetext",
        "executionType": "synchronous",
        "code": "1+3",
        "timeoutInSeconds": 100
    }
}'
```

#### c. InlineBase64

| Note: `MSsy` is base64 encoded value of `1+2`

```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "InlineBase64",
        "executionType": "synchronous",
        "code": "MSsy",
        "timeoutInSeconds": 100
    }
}'
```

4. ### Chart PNG to create file under local directory `/mnt/data` and download that file

#### a. Create file using your own code and save in /mnt/data location

```shell
curl --location "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/code/execute?identifier=$SESSION_IDENTIFIER_STRING" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN" \
--data '{
    "properties": {
        "identifier": "<SESSION_IDENTIFIER_STRING>",
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "$$.async(); var fs2 = require(\"fs\");\nvar path2 = require(\"path\");\n\n// Define the file path and content\nvar filePath2 = path.join(\"/mnt/data\", \"example.txt\");\nvar fileContent2 = \"Hello, this is a sample content!\";\n\n// Write the file\nfs2.writeFile(filePath2, fileContent2, (err) => {\nif (err) {\nconsole.log(`Error file creation  ${err.message}`);\nreturn console.error(`A problem occurred while writing the file: ${err.message}`);\n}\nconsole.log(\"File has been created and saved successfully!\");\n});\n setTimeout($$.done, 10000)",
        "timeoutInSeconds": 100
    }
}'
```

#### b. Download the created chart file

```shell
curl --location --request GET "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/files/content/example.txt?identifier=$SESSION_IDENTIFIER_STRING" \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN"
```

#### c. Upload a file

```shell
curl --location --request POST  "https://$SESSION_POOL_LOCATION.acasessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/sessionPools/$SESSION_POOL_NAME/files/upload?identifier=$SESSION_IDENTIFIER_STRING" \
-F file=@sample.jpeg \
--header "Authorization: Bearer  $DATAPLANE_BEARERTOKEN"
```
