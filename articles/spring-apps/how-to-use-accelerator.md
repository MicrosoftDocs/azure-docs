---
title: Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan
description: Learn how to use VMware Tanzu App Accelerator with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/29/2022
ms.author: caiqing
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to use [Application Accelerator for VMware Tanzu](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.5/tap/application-accelerator-about-application-accelerator.html) (App Accelerator) with the Azure Spring Apps Enterprise plan to bootstrap developing your applications in a discoverable and repeatable way.

App Accelerator helps you bootstrap developing your applications and deploying them in a discoverable and repeatable way. You can use App Accelerator to create new projects based on published accelerator projects. For more information, see [Application Accelerator for VMware Tanzu](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.5/tap/application-accelerator-about-application-accelerator.html) in the VMware documentation.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Understand and fulfill the requirements listed in the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the `spring-cloud` extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Enable App Accelerator

You can enable App Accelerator when you provision an Azure Spring Apps Enterprise plan instance. If you already have an Azure Spring Apps Enterprise plan resource, see the [Manage App Accelerator in an existing Enterprise plan instance](#manage-app-accelerator-in-an-existing-enterprise-plan-instance) section to enable it.

You can enable App Accelerator using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to enable App Accelerator using the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).
1. On the **Basics** tab, select **Enterprise tier** in the **Pricing** section and specify the required information. Then select **Next: VMware Tanzu settings**.
1. On the **VMware Tanzu settings** tab, select **Enable App Accelerator**.

   :::image type="content" source="media/how-to-use-accelerator/create-instance.png" alt-text="Screenshot of the Azure portal showing the VMware Tanzu settings tab of the Azure Spring Apps Create screen, with the Enable App Accelerator checkbox highlighted." lightbox="media/how-to-use-accelerator/create-instance.png":::

1. Specify other settings, and then select **Review and Create**.
1. On the **Review an create** tab, make sure that **Enable App Accelerator** and **Enable Dev Tools Portal** are set to **Yes**. Select **Create** to create the Enterprise plan instance.

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to provision an Azure Spring Apps service instance with App Accelerator enabled using the Azure CLI.

1. Use the following command to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Azure Spring Apps Enterprise plan. This step is necessary only if your subscription has never been used to create an Enterprise plan instance.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. The location must support the Azure Spring Apps Enterprise plan. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

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

Application Accelerator lets you generate new projects from files in Git repositories. The following table describes Application Accelerator's components:

| Component name            | Instance count | vCPU per instance | Memory per instance | Description                                                                                                                                                             |
|---------------------------|----------------|-------------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accelerator-server`      | 2              | 0.4 core          | 0.5Gi               | Serves API used by Dev Tools Portal to list available accelerators and options.                                                                                         |
| `accelerator-engine`      | 1              | 1 core            | 3Gi                 | Processes the input values and files (pulled from a snapshot of a Git repository) and applies dynamic transformations to generate projects.                             |
| `accelerator-controller`  | 1              | 0.2 core          | 0.25Gi              | Reconciles Application Accelerator resources.                                                                                                                           |
| `source-controller`       | 1              | 0.2 core          | 0.25Gi              | Registers a controller to reconcile the `ImageRepositories` and `MavenArtifacts` resources used by Application Accelerator.                                             |
| `flux-source-controller`  | 1              | 0.2 core          | 0.25Gi              | Registers a controller to reconcile `GithubRepository` resources used by Application Accelerator. Supports managing Git repository sources for Application Accelerator. |

You can see the running instances and resource usage of all the components using the Azure portal and Azure CLI.

### [Azure portal](#tab/Portal)

You can view the state of Application Accelerator in the Azure portal on the **Developer Tools** page, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/accelerator-components.png" alt-text="Screenshot of the Azure portal showing the Developer Tools page." lightbox="media/how-to-use-accelerator/accelerator-components.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command in the Azure CLI to view Application Accelerator.

```azurecli
az spring application-accelerator show \
    --service <Azure-Spring-Apps-service-instance-name> \
    --resource-group <resource-group-name>
```

---

## Configure Dev Tools to access Application Accelerator

To access Application Accelerator, you must configure Tanzu Dev Tools. For more information, see [Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan](./how-to-use-dev-tool-portal.md).

## Use Application Accelerator to bootstrap your new projects

To use Application Accelerator to bootstrap your new projects, you must get permissions to manage accelerators. You can then manage predefined accelerators or your own accelerators.

### Get permissions to manage accelerators

Managing your accelerators requires the following permissions:

- Read: Get Azure Spring Apps Predefined Accelerator
- Other: Disable Azure Spring Apps Predefined Accelerator
- Other: Enable Azure Spring Apps Predefined Accelerator
- Write: Create or Update Microsoft Azure Spring Apps Customized Accelerator
- Read: Get Azure Spring Apps Customized Accelerator

For more information, see [How to use permissions in Azure Spring Apps](./how-to-permissions.md).

### Manage predefined accelerators

You can start with several predefined accelerators to bootstrap your new projects. You can disable or enable the built-in accelerators according to your own preference.

You can manage predefined accelerators using the Azure portal or Azure CLI.

#### [Azure portal](#tab/Portal)

You can view the built-in accelerators in the Azure portal on the **Accelerators** tab, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/predefined-accelerator.png" alt-text="Screenshot of the Azure portal showing the Accelerators tab with built-in accelerators, with the Disable Accelerator button highlighted." lightbox="media/how-to-use-accelerator/predefined-accelerator.png":::

#### [Azure CLI](#tab/Azure-CLI)

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

In addition to using the predefined accelerators, you can create your own accelerators. You can use any Git repository in Azure Devops, GitHub, GitLab, or BitBucket.

Use the following steps to create and maintain your own accelerators:

First, create a file named *accelerator.yaml* in the root directory of your Git repository.

You can use the *accelerator.yaml* file to declare input options that users fill in using a form in the UI. These option values control processing by the template engine before it returns the zipped output files. If you don't include an *accelerator.yaml* file, the repository still works as an accelerator, but the files are passed unmodified to users. For more information, see [Creating an accelerator.yaml file](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.5/tap/application-accelerator-creating-accelerators-accelerator-yaml.html).

Next, publish the new accelerator.

After you create your *accelerator.yaml* file, you can create your accelerator. You can then view it in the Azure portal or the Application Accelerator page in Dev Tools Portal. You can publish the new accelerator using the Azure portal or Azure CLI.

#### [Azure portal](#tab/Portal)

To create your own accelerator, open the **Accelerators** section and then select **Add Accelerator** under the Customized Accelerators section.

:::image type="content" source="media/how-to-use-accelerator/add-accelerator.png" alt-text="Screenshot of the Azure portal showing the Developer Tools page Accelerators tab, with the Add Accelerator button highlighted." lightbox="media/how-to-use-accelerator/add-accelerator.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to create your own accelerator in Azure CLI:

```azurecli
az spring application-accelerator customized-accelerator create \
    --name <customized-accelerator-name> \
    --service <service-instance-name> \
    --resource-group <resource-group-name> \
    --display-name <display-name> \
    --git-url <git-repo-url> \
   [--description <description>] \
   [--icon-url <icon-url>] \
   [--accelerator-tags <tags-on-accelerator>] \
   [--git-interval <git-repository-refresh-interval-in-seconds>] \
   [--git-branch <git-branch-name>] \
   [--git-commit <git-commit-ID>] \
   [--git-tag <git-tag>] \
   [--ca-cert-name <ca-cert-name>] \
   [--username] \
   [--password] \
   [--private-key] \
   [--host-key] \
   [--host-key-algorithm]
```

---

The following table describes the customizable accelerator fields.

| Portal                             | CLI                       | Description                                                                                                                                                                                                                                                                                                                                                                     | Required/Optional                                              |
|------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| **Name**                           | `name`                    | A unique name for the accelerator. The name can't change after you create it.                                                                                                                                                                                                                                                                                                   | Required                                                       |
| **Description**                    | `display-name`            | A longer description of the accelerator.                                                                                                                                                                                                                                                                                                                                        | Optional                                                       |
| **Icon url**                       | `icon-url`                | A URL for an image to represent the accelerator in the UI.                                                                                                                                                                                                                                                                                                                      | Optional                                                       |
| **Tags**                           | `accelerator-tags`        | An array of strings defining attributes of the accelerator that can be used in a search in the UI.                                                                                                                                                                                                                                                                              | Optional                                                       |
| **Git url**                        | `git-url`                 | The repository URL of the accelerator source Git repository. The URL can be an HTTP/S or SSH address.  The [scp-like syntax](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_ssh_protocol) isn't supported for SSH addresses (for example, `user@example.com:repository.git`). Instead, the valid URL format is `ssh://user@example.com:22/repository.git`. | Required                                                       |
| **Git interval**                   | `git-interval-in-seconds` | The interval at which to check for repository updates. If not specified, the interval defaults to 10 minutes. There's also a refresh interval (currently 10 seconds) before accelerators may appear in the UI. There could be a 10-second delay before changes are reflected in the UI.                                                                                         | Optional                                                       |
| **Git branch**                     | `git-branch`              | The Git branch to check out and monitor for changes. You should specify only the Git branch, Git commit, or Git tag.                                                                                                                                                                                                                                                            | Optional                                                       |
| **Git commit**                     | `git-commit`              | The Git commit SHA to check out. You should specify only the Git branch, Git commit, or Git tag.                                                                                                                                                                                                                                                                                | Optional                                                       |
| **Git tag**                        | `git-tag`                 | The Git commit tag to check out. You should specify only the Git branch, Git commit, or Git tag.                                                                                                                                                                                                                                                                                | Optional                                                       |
| **Git sub path**                   | `git-sub-path`            | The folder path inside the Git repository to consider as the root of the accelerator or fragment.                                                                                                                                                                                                                                                                               | Optional                                                       |
| **Authentication type**            | `N/A`                     | The authentication type of the accelerator source repository. The type can be `Public`, `Basic auth`, or `SSH`.                                                                                                                                                                                                                                                                 | Required                                                       |
| **User name**                      | `username`                | The user name to access the accelerator source repository whose authentication type is `Basic auth`.                                                                                                                                                                                                                                                                            | Required when the authentication type is `Basic auth`.         |
| **Password/Personal access token** | `password`                | The password to access the accelerator source repository whose authentication type is `Basic auth`.                                                                                                                                                                                                                                                                             | Required when the authentication type is `Basic auth`.         |
| **Private key**                    | `private-key`             | The private key to access the accelerator source repository whose authentication type is `SSH`. Only OpenSSH private key is supported.                                                                                                                                                                                                                                          | Required when authentication type is `SSH`.                    |
| **Host key**                       | `host-key`                | The host key to access the accelerator source repository whose authentication type is `SSH`.                                                                                                                                                                                                                                                                                    | Required when the authentication type is `SSH`.                |
| **Host key algorithm**             | `host-key-algorithm`      | The host key algorithm to access the accelerator source repository whose authentication type is `SSH`. Can be `ecdsa-sha2-nistp256` or `ssh-rsa`.                                                                                                                                                                                                                               | Required when authentication type is `SSH`.                    |
| **CA certificate name**            | `ca-cert-name`            | The CA certificate name to access the accelerator source repository with self-signed certificate whose authentication type is `Public` or `Basic auth`.                                                                                                                                                                                                                         | Required when a self-signed cert is used for the Git repo URL. |
| **Type**                           | `type`                    | The type of customized accelerator. The type can be `Accelerator` or `Fragment`. The default value is `Accelerator`.                                                                                                                                                                                                                                                                     | Optional                                                       |

To view all published accelerators, see the App Accelerators section of the **Developer Tools** page. Select the App Accelerator URL to view the published accelerators in Dev Tools Portal:

:::image type="content" source="media/how-to-use-accelerator/tap-gui-url.png" alt-text="Screenshot of the Azure portal showing the Developer Tools page with the App Accelerator URL highlighted." lightbox="media/how-to-use-accelerator/tap-gui-url.png":::

To view the newly published accelerator, refresh Dev Tools Portal.

:::image type="content" source="media/how-to-use-accelerator/tap-gui-accelerator.png" alt-text="Screenshot of the VMware Tanzu Dev Tools for Azure Spring Apps Application Accelerators page." lightbox="media/how-to-use-accelerator/tap-gui-accelerator.png":::

> [!NOTE]
> It might take a few seconds for Dev Tools Portal to refresh the catalog and add an entry for your new accelerator. The refresh interval is configured as `git-interval` when you create the accelerator. After you change the accelerator, it will also take time to be reflected in Dev Tools Portal. The best practice is to change the `git-interval` to speed up for verification after you apply changes to the Git repo.

### Reference a fragment in your own accelerators

Writing and maintaining accelerators can become repetitive and verbose as new accelerators are added. Some people create new projects by copying existing ones and making modifications, but this process can be tedious and error prone. To make the creation and maintenance of accelerators easier, Application Accelerator supports a feature named Composition that allows the reuse of parts of an accelerator, called *fragments*.

Use following steps to reference a fragment in your accelerator:

1. Publish the new accelerator of type `Fragment` using the Azure portal or the Azure CLI.

   #### [Azure portal](#tab/Portal)

   To create a fragment accelerator, open the **Accelerators** section, select **Add Accelerator** under the **Customized Accelerators** section, and then select **Fragment**.

   :::image type="content" source="media/how-to-use-accelerator/add-fragment.png" alt-text="Screenshot of the Azure portal that shows the Customized Accelerators of type `Fragment`." lightbox="media/how-to-use-accelerator/add-fragment.png":::

   #### [Azure CLI](#tab/Azure-CLI)

   Use the following command to create a customized accelerator of type `Fragment`:

   ```azurecli
   az spring application-accelerator customized-accelerator create \
       --resource-group <resource-group-name> \
       --service <service-instance-name> \
       --name <fragment-accelerator-name> \
       --display-name <display-name> \
       --type Fragment \
       [--git-sub-path <sub project path>] \
       --git-url <git-repo-URL>
   ```

1. Change the *accelerator.yaml* file in your accelerator project. Use the `imports` instruction in the `accelerator` section and the `InvokeFragment` instruction in the `engine` section to reference the fragment in the accelerator, as shown in the following example:

   ```yaml
   accelerator:
       ...
     # options for the UI
     options:
       ...
     imports:
     - name: <fragment-accelerator-name>
     ...
   
   engine:
     chain:
       ...
     - merge:
       - include: [ "**" ]
       - type: InvokeFragment
         reference: <fragment-accelerator-name>
   ```

1. Synchronize the change with the Dev Tools Portal.

   To reflect the changes on the Dev Tools Portal more quickly, you can provide a value for the **Git interval** field of your customized accelerator. The **Git interval** value indicates how frequently the system checks for updates in the Git repository.

1. Synchronize the change with your customized accelerator on the Azure portal by using the Azure portal or the Azure CLI.

   #### [Azure portal](#tab/Portal)

   The following list shows the two ways you can sync changes:

   - Create or update your customized accelerator.
   - Open the **Accelerators** section, and then select **Sync certificate**.

   #### [Azure CLI](#tab/Azure-CLI)

   Use the following command to sync changes for an accelerator:

   ```azurecli
   az spring application-accelerator customized-accelerator sync-cert \
       --name <customized-accelerator-name> \
       --service <service-instance-name> \
       --resource-group <resource-group-name>
   ```

For more information, see [Use fragments in Application Accelerator](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.5/tap/application-accelerator-creating-accelerators-composition.html) in the VMware documentation.

### Use accelerators to bootstrap a new project

Use the following steps to bootstrap a new project using accelerators:

1. On the **Developer Tools** page, select the App Accelerator URL to open the Dev Tools Portal.

   :::image type="content" source="media/how-to-use-accelerator/tap-gui-url.png" alt-text="Screenshot of the Azure portal showing the Developer Tools page with the App Accelerator URL highlighted." lightbox="media/how-to-use-accelerator/tap-gui-url.png":::

1. On the Dev Tools Portal, select an accelerator.

1. Specify input options in the **Configure accelerator** section of the **Generate Accelerators** page.

   :::image type="content" source="media/how-to-use-accelerator/configure-accelerator.png" alt-text="Screenshot of the VMware Tanzu Dev Tools for Azure Spring Apps Generate Accelerators page showing the Configure accelerator section." lightbox="media/how-to-use-accelerator/configure-accelerator.png":::

1. Select **EXPLORE FILE** to view the project structure and source code.

   :::image type="content" source="media/how-to-use-accelerator/explore-accelerator-project.png" alt-text="Screenshot of the VMware Tanzu Dev Tools for Azure Spring Apps Explore project pane." lightbox="media/how-to-use-accelerator/explore-accelerator-project.png":::

1. Select **Review and generate** to review the specified parameters, and then select **Generate accelerator**.

   :::image type="content" source="media/how-to-use-accelerator/generate-accelerator.png" alt-text="Screenshot of the VMware Tanzu Dev Tools for Azure Spring Apps Generate Accelerators page showing the Review and generate section." lightbox="media/how-to-use-accelerator/generate-accelerator.png":::

1. You can then view or download the project as a zip file.

   :::image type="content" source="media/how-to-use-accelerator/download-file.png" alt-text="Screenshot the VMware Tanzu Dev Tools for Azure Spring Apps showing the Task Activity pane." lightbox="media/how-to-use-accelerator/download-file.png":::

### Configure accelerators with a self-signed certificate

When you set up a private Git repository and enable HTTPS with a self-signed certificate, you should configure the CA certificate name to the accelerator for client certificate verification from the accelerator to the Git repository.

Use the following steps to configure accelerators with a self-signed certificate:

1. Import the certificates into Azure Spring Apps. For more information, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).
2. Configure the certificate for the accelerator by using the Azure portal or the Azure CLI.

#### [Azure portal](#tab/Portal)

To configure a certificate for an accelerator, open the **Accelerators** section and then select **Add Accelerator** under the **Customized Accelerators** section. Then, select the certificate from the dropdown list.

:::image type="content" source="media/how-to-use-accelerator/config-cert.png" alt-text="Screenshot of the Azure portal showing the Add Accelerator pane." lightbox="media/how-to-use-accelerator/config-cert.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure a certificate for the accelerator:

```azurecli
az spring application-accelerator customized-accelerator create \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name <customized-accelerator-name> \
    --git-url <git-repo-URL> \
    --ca-cert-name <ca-cert-name>
```

---

### Rotate certificates

As certificates expire, you need to rotate certificates in Spring Cloud Apps by using the following steps:

1. Generate new certificates from a trusted CA.
1. Import the certificates into Azure Spring Apps. For more information, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).
1. Synchronize the certificates using the Azure portal or the Azure CLI.

The accelerators won't automatically use the latest certificate. You should sync one or all certificates by using the Azure portal or the Azure CLI.

#### [Azure portal](#tab/Portal)

To sync certificates for all accelerators, open the **Accelerators** section and then select **Sync certificate**, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/sync-all-cert.png" alt-text="Screenshot of the Azure portal showing the Customized Accelerators pane with the Sync certificate button highlighted." lightbox="media/how-to-use-accelerator/sync-all-cert.png":::

To sync a certificate for a single accelerator, open the **Accelerators** section and then select **Sync certificate** from the context menu of an accelerator, as shown in the following screenshot:

:::image type="content" source="media/how-to-use-accelerator/sync-cert.png" alt-text="Screenshot or the Azure portal showing the Customized Accelerators pane with the Sync certificate context menu option highlighted." lightbox="media/how-to-use-accelerator/sync-cert.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to sync certificates for an accelerator:

```azurecli
az spring application-accelerator customized-accelerator sync-cert \
    --name <customized-accelerator-name> \
    --service <service-instance-name> \
    --resource-group <resource-group-name>
```

---

## Manage App Accelerator in an existing Enterprise plan instance

You can enable App Accelerator under an existing Azure Spring Apps Enterprise plan instance using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

If a Dev tools public endpoint has already been exposed, you can enable App Accelerator, and then press <kbd>Ctrl</kbd>+<kbd>F5</kbd> to deactivate the browser cache to view it on the Dev Tools Portal.

Use the following steps to enable App Accelerator under an existing Azure Spring Apps Enterprise plan instance using the Azure portal:

1. Navigate to your service resource, and then select **Developer Tools**.
1. Select **Manage tools**.
1. Select **Enable App Accelerator**, and then select **Apply**.

   :::image type="content" source="media/how-to-use-accelerator/enable-app-accelerator.png" alt-text="Screenshot of the Azure portal showing the Manage tools pane with the Enable App Accelerator option highlighted." lightbox="media/how-to-use-accelerator/enable-app-accelerator.png":::

You can view whether App Accelerator is enabled or disabled on the **Developer Tools** page.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable App Accelerator for an Azure Spring Apps service instance using the Azure CLI:

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

To access the Dev Tools Portal, make sure it's enabled with an assigned public endpoint. Use the following command to enable the Dev Tools Portal:

```azurecli
az spring dev-tool create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --assign-endpoint
```

---

## Next steps

- [Azure Spring Apps](index.yml)
