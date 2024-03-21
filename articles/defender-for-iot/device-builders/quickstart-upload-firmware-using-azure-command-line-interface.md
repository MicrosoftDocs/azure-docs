---
title: "Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Azure CLI"
description: "Learn how to upload firmware images for analysis using the Azure CLI."
author: karengu0
ms.author: karenguo
ms.topic: quickstart
ms.date: 01/29/2024

---

# Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Azure CLI

This article explains how to use the Azure CLI to upload firmware images to Defender for IoT Firmware Analysis.

[Defender for IoT Firmware Analysis](/azure/defender-for-iot/device-builders/overview-firmware-analysis) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.

## Prerequisites

This quickstart assumes a basic understanding of Defender for IoT Firmware Analysis. For more information, see [Firmware analysis for device builders](/azure/defender-for-iot/device-builders/overview-firmware-analysis). For a list of the file systems that are supported, see [Frequently asked Questions about Defender for IoT Firmware Analysis](../../../articles/defender-for-iot/device-builders/defender-iot-firmware-analysis-faq.md#what-types-of-firmware-images-does-defender-for-iot-firmware-analysis-support).

### Prepare your environment for the Azure CLI

* [Install](/cli/azure/install-azure-cli) the Azure CLI to run CLI commands locally. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

* Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index?#az-login) command. Follow the steps displayed in your terminal to finish the authentication process. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

* When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
    * Install the Defender for IoT Firmware Analysis extension by running the following command:
        ```azurecli
        az extension add --name firmwareanalysis
        ```

* To find the version and dependent libraries that are installed, run the command [az version](/cli/azure/reference-index?#az-version). To upgrade to the latest version, run the command [az upgrade](/cli/azure/reference-index?#az-upgrade).

* [Onboard](../../../articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md#onboard-your-subscription-to-use-defender-for-firmware-analysis) your subscription to Defender for IoT Firmware Analysis.

* Select the appropriate subscription ID where you'd like to upload your firmware images by running the command [az account set](/cli/azure/account?#az-account-set).

## Upload a firmware image to the workspace

1. Create a firmware image to be uploaded. Insert your resource group name, subscription ID, and workspace name into the respective parameters.

    ```azurecli
    az firmwareanalysis firmware create --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default
    ```

The output of this command includes a `name` property, which is your firmware ID. **Save this ID for the next command.**

2. Generate a SAS URL, which you'll use in the next step to send your firmware image to Azure Storage. Replace `sampleFirmwareID` with the firmware ID that you saved from the previous step. You can store the SAS URL in a variable for easier access for future commands:

    ```azurecli
    $sasURL = $(az firmwareanalysis workspace generate-upload-url --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID --query "url")
    ```

3. Upload your firmware image to Azure Storage. Replace `pathToFile` with the path to your firmware image on your local machine.

    ```azurecli
    az storage blob upload -f pathToFile --blob-url $sasURL
    ```

Here's an example workflow of how you could use these commands to create and upload a firmware image. To learn more about using variables in CLI commands, visit [How to use variables in Azure CLI commands](/cli/azure/azure-cli-variables?tabs=bash):

```azurecli
$filePath='/path/to/image'
$resourceGroup='myResourceGroup'
$workspace='default'

$fileName='file1'
$vendor='vendor1'
$model='model'
$version='test'

$FWID=$(az firmwareanalysis firmware create --resource-group $resourceGroup --workspace-name $workspace --file-name $fileName --vendor $vendor --model $model --version $version --query "name")

$URL=$(az firmwareanalysis workspace generate-upload-url --resource-group $resourceGroup --workspace-name $workspace --firmware-id $FWID --query "url")

$OUTPUT=(az storage blob upload -f $filePath --blob-url $URL)
```

## Retrieve firmware analysis results

To retrieve firmware analysis results, you must make sure that the status of the analysis is "Ready":

```azurecli
az firmwareanalysis firmware show --firmware-id sampleFirmwareID --resource-group myResourceGroup --workspace-name default
```

Look for the "status" field to display "Ready", then run the following commands to retrieve your firmware analysis results.

If you would like to automate the process of checking your analysis's status, you can use the [`az resource wait`](/cli/azure/resource?#az-resource-wait) command.

The `az resource wait` command has a `--timeout` parameter, which is the time in seconds that the analysis will end if "status" does not reach "Ready" within the timeout frame. The default timeout is 3600, which is one hour. Large images may take longer to analyze, so you can set the timeout using the `--timeout` parameter according to your needs. Here's an example of how you can use the `az resource wait` command with the `--timeout` parameter to automate checking your analysis's status, assuming that you have already created a firmware and stored the firmware ID in a variable named `$FWID`:

```azurecli
$ID=$(az firmwareanalysis firmware show --resource-group $resourceGroup --workspace-name $workspace --firmware-id $FWID --query "id")

Write-Host (‘Successfully created a firmware image with the firmware ID of ‘ + $FWID + ‘, recognized in Azure by this resource ID: ‘ + $ID + ‘.’)

$WAIT=$(az resource wait --ids $ID --custom "properties.status=='Ready'" --timeout 10800) 

$STATUS=$(az resource show --ids $ID --query 'properties.status')

Write-Host ('Firmware analysis completed with status: ' + $STATUS)
```

Once you've confirmed that your analysis status is "Ready", you can run commands to pull the results.

### SBOM

The following command retrieves the SBOM in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware sbom-component --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```

### Weaknesses

The following command retrieves CVEs found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware cve --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```

### Binary hardening

The following command retrieves analysis results on binary hardening in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware binary-hardening --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```

### Password hashes

The following command retrieves password hashes in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware password-hash --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```

### Certificates

The following command retrieves vulnerable crypto certificates that were found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware crypto-certificate --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```

### Keys

The following command retrieves vulnerable crypto keys that were found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```azurecli
az firmwareanalysis firmware crypto-key --resource-group myResourceGroup --subscription 123e4567-e89b-12d3-a456-426614174000 --workspace-name default --firmware-id sampleFirmwareID
```
