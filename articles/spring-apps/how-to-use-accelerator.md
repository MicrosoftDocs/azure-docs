---
title: Use VMware Tanzu Application Accelerator with Azure Spring Apps Enterprise tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: Learn how to use VMware Tanzu App Accelerator with Azure Spring Apps Enterprise tier.
author: karlerickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/01/2022
ms.author: caiqing
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use VMware Tanzu Application Accelerator with Azure Spring Apps Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use [Application Accelerator for VMware Tanzu®](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-application-accelerator-about-application-accelerator.html) with Azure Spring Apps Enterprise tier to bootstrap developing your applications in a discoverable and repeatable way.

## Prerequisites


- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- To provision an Azure Marketplace offer purchase, see the [Prerequisites](how-to-enterprise-marketplace-offer.md#prerequisites) section of [View Azure Spring Apps Enterprise tier offering from Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the `spring-cloud` extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Enable App Accelerator

You can enable App Accelerator when you provision an Azure Spring Apps Enterprise tier instance. If you already have an Azure Spring Apps Enterprise tier resource, see the [Manage App Accelerator in existing Enterprise tier instances](#manage-app-accelerator-in-existing-enterprise-tier-instances) section to enable it.

You can enable App Accelerator using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to enable App Accelerator using the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).
1. On the **Basics** tab, select **Enterprise tier** in the **Pricing** section and specify the required information. Then click **Next: VMware Tanzu settings**.
1. On the **VMware Tanzu settings** tab, select the **Enable App Accelerator** checkbox.

   :::image type="content" source="media/how-to-use-accelerator/create-instance.png" alt-text="Screenshot of the VMware Tanzu settings tab showing the App Accelerators checkbox." lightbox="media/how-to-use-accelerator/create-instance.png":::

1. Specify other settings, and then select **Review and Create**.
1. On the **Review an create** tab, make sure that **Enable App Accelerator** and **Enable Dev Tools Portal** are set to *Yes*. Select **Create** to create the Enterprise tier instance.

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to provision an Azure Spring Apps service instance with App Accelerator enabled using the Azure CLI.

1. Use the following command to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for Azure Spring Apps Enterprise tier. This step is necessary only if your subscription has never been used to create an Enterprise tier instance.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. The location must support Azure Spring Apps Enterprise tier. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create an Azure Spring Apps service instance with App Accelerator enabled:

    ```azurecli
    az spring create \
        --resource-group <resource-group-name> \
        --name <Azure-Spring-Apps-service-instance-name> \
        --sku enterprise \
        --enable-application-accelerator
    ```

---

## Monitor App Accelerator

Application Accelerator lets you to generate new projects from files in Git repositories. The following table describes Application Accelerator's components:

| Component name          | Instance count | vCPU per instance | Memory per instance | Description                                                                                                                                                             |
|--------------------------|-----------------|--------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| accelerator-server      | 2              | 0.4 core          | 0.5Gi               | Serves API used by Dev Tools Portal to list available accelerators and options.                                                                                         |
| accelerator-engine      | 1              | 1 core            | 3Gi                 | Processes the input values and files(pulled from a snapshot of a Git repository) and applies dynamic transformations to generate projects.                              |
| accelerator-controller  | 1              | 0.2 core          | 0.25Gi              | Reconciles Application Accelerator resources.                                                                                                                           |
| source-controller       | 1              | 0.2 core          | 0.25Gi              | Registers a controller to reconcile the `ImageRepositories` and `MavenArtifacts` resources used by Application Accelerator.                                             |
| cert-manager            | 1              | 0.2 core          | 0.25Gi              | See [cert-manager](https://cert-manager.io/docs/) in the cert-manager documentation.                                                                                    |
| cert-manager-webhook    | 1              | 0.2 core          | 0.25Gi              | See [cert-manager webhook](https://cert-manager.io/docs/concepts/webhook/) in the cert-manager documentation.                                                           |
| cert-manager-cainjector | 1              | 0.2 core          | 0.25Gi              | See [cert-manager ca-injector](https://cert-manager.io/docs/concepts/ca-injector/) in the cert-manager documentation.                                                   |
| flux-source-controller  | 1              | 0.2 core          | 0.25Gi              | Registers a controller to reconcile `GithubRepository` resources used by Application Accelerator. Supports managing Git repository sources for Application Accelerator. |

You can see the running instances and resource usage of all the components using the Azure portal and Azure CLI.

### [Azure portal](#tab/Portal)

You can view the state of Application Accelerator in the Azure portal on the **Developer Tools (Preview)** page, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/accelerator-components.png" alt-text="Screenshot of the Developer Tools (Preview) page." lightbox="media/how-to-use-accelerator/accelerator-components.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command in the Azure CLI to view Application Accelerator.

```azurecli
az spring application-accelerator show \
    --service <Azure-Spring-Apps-service-instance-name> \
    --resource-group <resource-group-name>
```

---

## Configure Dev Tools to access Application Accelerator

To access Application Accelerator, you must configure VMware Tanzu Application Platform GUI tools. For more information, see [Use Tanzu Application Platform GUI tools in Azure Spring Apps Enterprise tier](./how-to-use-dev-tool-portal.md).

## Use Application Accelerator to bootstrap your new projects

To use Application Accelerator to bootstrap your new projects, you must get permissions to manage accelerators. You can then manage predefined accelerators or your own accelerators.

### Get Permissions to manage accelerators

Managing your accelerators requires the following permissions:

- Read : Get Azure Spring Apps Predefined Accelerator
- Other: Disable Azure Spring Apps Predefined Accelerator
- Other: Enable Azure Spring Apps Predefined Accelerator
- Write : Create or Update Microsoft Azure Spring Apps Customized Accelerator
- Read : Get Azure Spring Apps Customized Accelerator

For more information, see [How to use permissions in Azure Spring Apps | Microsoft Learn](./how-to-permissions.md)

### Manage predefined accelerators

You can start with several predefined accelerators to bootstrap your new projects. You can disable or enable the built-in accelerators according to your own preference.

You can manage predefined accelerators using the Azure portal or Azure CLI.

### [Portal](#tab/Portal)

You can view the built-in accelerators in the Azure portal on the **Accelerators** tab, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/predefined-accelerator.png" alt-text="Screenshot of the Accelerators tab showing built-in accelerators." lightbox="media/how-to-use-accelerator/predefined-accelerator.png":::

### [CLI](#tab/Azure-CLI)

Use the following command in the Azure CLI to view a list of built-in accelerators:

  ```azurecli
  az spring application-accelerator predefined-accelerator list \
      --service <service-instance-name> \
      --resource-group <resource-group-name>
  ```

Use the following command to disable a built-in predefined accelerator:

  ```azurecli
  az spring application-accelerator predefined-accelerator disable \
      --name <predefined-accelerator-name> \
      --service <service-instance-name> \
      --resource-group <resource-group-name>
  ```

Use the following command to enable a built-in predefined accelerator:

  ```azurecli
  az spring application-accelerator predefined-accelerator enable \
    --name <predefined-accelerator-name> \
    --service <service-instance-name> \
    --resource-group <resource-group-name>
  ```

---

### Manage your own accelerators

In addition to using the predefined accelerators, you can create your own accelerators. You can use any Git repository in GitHub, GitLab, or BitBucket.

Use to following steps to create and maintain your own accelerators.

1. Create a file named *accelerator.yaml* in the root directory of your Git repository.

   You can use the *accelerator.yaml* file to declare input options that users fill in using a form in the UI. These option values control processing by the template engine before it returns the zipped output files. If you don't include an *accelerator.yaml* file, the repository still works as an accelerator but the files are passed unmodified to users. For more information, see [Creating an accelerator.yaml file](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-application-accelerator-creating-accelerators-accelerator-yaml.html).

   You can also use **Template Editor** in Dev Tools Portal to edit your *accelerator.yaml* file for visualization and syntax check.

   :::image type="content" source="media/how-to-use-accelerator/template-editor-entry.png" alt-text="Screenshot of the Application Accelerators page in Dev Tools Portal." lightbox="media/how-to-use-accelerator/template-editor-entry.png":::

   You can use Template Editor to preview the input options and steps of accelerators. During creation of a new accelerator, you can confirm that the input options and steps are correct and the YAML file is valid. You can also copy and paste the content of an existing *accelerator.yaml* file and edit it to see the updated view.

   :::image type="content" source="media/how-to-use-accelerator/template-editor.png" alt-text="Screenshot of the Template Editor." lightbox="media/how-to-use-accelerator/template-editor.png":::
  
1. Publish the new accelerator.

   After you create your *accelerator.yaml* file, you can create your accelerator. You can then view it in Azure portal or the Applicaiton Accelerator page in Dev Tools Portal. You can publish the new accelerator using the Azure portal or Azure CLI.

   ### [Azure portal](#tab/Portal)

   To create your own accelerator, open the **Accelerators** section and click **Add Accelerator** under the Customized Accelerators section.

   :::image type="content" source="media/how-to-use-accelerator/add-accelerator.png" alt-text="Screenshot of the Developer Tools (Preview) page showing the Customized Accelerators section." lightbox="media/how-to-use-accelerator/add-accelerator.png":::

   ### [Azure CLI](#tab/Azure-CLI)

   Use the following command to create your own accelerator in Azure CLI:

     ```azurecli
     az spring application-accelerator customized-accelerator add \
       --name <customized-accelerator-name> \
       --service <service-instance-name> \
       --resource-group <resource-group-name> \
       --display-name <display-name> \
       --git-url <git-repo-url> \
      [--description <description>] \
      [--icon-url <icon-url>] \
      [--accelerator-tags <tags-on-accelerator>] \
      [--git-interval-in-seconds <interval-in-seconds>] \
      [--git-branch <branch-name>] \
      [--git-commit <commit-id>] \
      [--git-tag <tag-in-git>] \
      [--username] \
      [--password] \
      [--private-key] \
      [--host-key] \
      [--host-key-algorithm]
      ```

   The following table describes the customizable accelerator fields.

   | Portal                         | CLI                     | Description                                                                                                                                                                                                                                                                                                                                                                                                               | Required/Optional                                     |
   |---------------------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
   | Name                           | name                    | A unique name for the accelerator. The name can't change after you create it.                                                                                                                                                                                                                                                                                                                                             | Required                                              |  | Display name | description | A short descriptive name used for the accelerator. | Optional |
   | Description                    | display-name            | A longer description of the accelerator.                                                                                                                                                                                                                                                                                                                                                                                  | Optional                                              |
   | Icon url                       | icon-url                | A URL for an image to represent the accelerator in the UI.                                                                                                                                                                                                                                                                                                                                                                | Optional                                              |
   | Tags                           | accelerator-tags        | An array of strings defining attributes of the accelerator that can be used in a search in the UI.                                                                                                                                                                                                                                                                                                                        | Optional                                              |
   | Git url                        | git-url                 | The repository URL of the accelerator source Git repository. The URL can be an HTTP/S or SSH address.                                                                                                                                                                                                                                                                                                                     | Required                                              |
   | Git interval                   | git-interval-in-seconds | The interval at which to check for repository updates. If not specified, the interval defaults to 10 minutes. There is an additional refresh interval (currently 10 seconds) before accelerators may appear in the UI. There could be a 10-second delay before changes are reflected in the UI.                                                                                                                           | Optional                                              |
   | Git branch                     | git-branch              | The Git branch to checkout and monitor for changes. Only one of git branch, git commit, and git tag should be specified.                                                                                                                                                                                                                                                                                                  | Optional                                              |
   | Git commit                     | git-commit              | The Git commit SHA to checkout. Only one of git branch, git commit, and git tag should be specified.                                                                                                                                                                                                                                                                                                                      | Optional                                              |
   | Git tag                        | git-tag                 | The Git commit tag to checkout. Only one of git branch, git commit, and git tag should be specified.                                                                                                                                                                                                                                                                                                                      | Optional                                              |
   | Authentication type            | N/A                     | The authentication type of the accelerator source repository. The type can be `Public`, `Basic auth` or `SSH`.  Note: Unlike using git, the [shorter scp-like syntax](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_ssh_protocol) is not supported for SSH addresses (for example, `user@example.com:repository.git`). Instead, the valid URL format is `ssh://user@example.com:22/repository.git`. | Required                                              |
   | User name                      | username                | The user name to access the accelerator source repository whose authentication type is `Basic auth`.                                                                                                                                                                                                                                                                                                                      | Required when the authentication type is `Basic auth` |
   | Password/Personal access token | password                | The password to access the accelerator source repository whose authentication type is `Basic auth`.                                                                                                                                                                                                                                                                                                                       | Required when the authentication type is `Basic auth` |
   | Private key                    | private-key             | The private key to access the accelerator source repository whose authentication type is `SSH`. Note: Only OpenSSH private key is supported.                                                                                                                                                                                                                                                                              | Required when authentication type is `SSH`            |
   | Host key                       | host-key                | The host key to access the accelerator source repository whose authentication type is `SSH`.                                                                                                                                                                                                                                                                                                                              | Required when the authentication type is `SSH`        |
   | Host key algorithm             | host-key-algorithm      | The host key algothrihm to access the accelerator source repository whose authentication type is `SSH`, can be `ecdsa-sha2-nistp256` or `ssh-rsa`.                                                                                                                                                                                                                                                                        | Required when authentication type is `SSH`            |

---

To view all the published accelerators, see the App Accelerators section of the **Developer Tools (Preview)** page. Select the App Accelerator URL to view the published accelerators in Dev Tools Portal:

	![tap-gui-link](./media/how-to-use-accelerator/tap-gui-url.png)   

    You need to refresh the Dev Tools Portal to reveal the newly published accelerator.

    ![tap-gui-accelerator](./media/how-to-use-accelerator/tap-gui-accelerator.png)   

    > [!NOTE]
    > It might take a few seconds for Dev Tools Portal to refresh the catalog and add an entry for your new accelerator. The refresh interval is configured as git interval when you create the accelerator. After changing the accelerator, it will also take time to be reflected in Dev Tools Portal. The best practice can be changing the git interval to speed up for verification after changes applied into git repo.

### Use accelerators to bootstrap a new project

Click **App Accelerator URL** to access Dev Tools Portal.
![tap-gui-link](./media/how-to-use-accelerator/tap-gui-url.png)   
Jump to Dev Tools Portal, you can choose one accelerator to explore file and download as zip file.
In the "Configure accelerator" step, you can input values for your input options.
![configure-accelerator](./media/how-to-use-accelerator/configure-accelerator.png)   
Click **EXPLORE FILE**, you will see the project structure and view source code.
![explore-accelerator-project](./media/how-to-use-accelerator/explore-accelerator-project.png)   
Go to the "Review and generate" step, you can review your provided paramenters and generator your project.
![generate-accelerator-](./media/how-to-use-accelerator/generate-accelerator.png)   
Click **GENERATE ACCELERATOR**, it will start a task to process provided paramenters and zip files from accelerator. After the task is completed, you're free to download the project as zip file.
![download-accelerator-](./media/how-to-use-accelerator/download-file.png)   

## Manage App Accelerator in existing Enterprise tier instances

This section instructs you how to enable the App Accelerator under an existing Azure Spring Apps Enterprise tier instance.

If Dev tools public endpoint has already been exposed, then after enabling App Accelerator here, please use Ctrl+F5 to inactivate browser cache in order to see it on the Dev Tools Portal.

### [Portal](#tab/Portal)

1. Navigate to your Service resource. Click "Developer Tools (Preview)".
1. Click "Manage tools".
1. Check the App Accelerators checkbox and click "Apply"

    ![Enable-Application-Accelerator](./media/how-to-use-accelerator/enable-app-accelerator.png)

1. After it is saved successfully, you can view the state of App Accelerator in the "Developer Tools (Preview)" blade.

### [CLI](#tab/Azure-CLI)

Use the following command to enable App Accelerator for an Azure Spring Apps service instance:
```azurecli
az spring application-accelerator create \
    --service <Azure-Spring-Apps-service-instance-name> \
    --resource-group <resource-group-name>
```

Use the following command to disable App Accelerator for an Azure Spring Apps service instance:
```azurecli
az spring application-accelerator delete \
    --service <Azure-Spring-Apps-service-instance-name> \
    --resource-group <resource-group-name>
```

> To access the Dev Tools Portal, please make sure Dev Tools Portal is enabled with public endpoint assigned. Run this command by using Azure CLI if the component is not enabled.
> ```azurecli
> az spring dev-tool create \
>    --resource-group <resource-group-name> \
>    --service <Azure-Spring-Apps-service-instance-name> \
>    --assign-endpoint
> ```

---

## Next steps

- [Azure Spring Apps](index.yml)
