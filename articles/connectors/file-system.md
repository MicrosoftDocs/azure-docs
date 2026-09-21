---
title: Connect to On-premises File Systems from Workflows
description: Connect to on-premises file systems from workflows in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 09/15/2026
ms.custom: sfi-image-nochange
#Customer intent: As an automation and integration developer who works with Azure Logic Apps, I want to connect my workflows to on-premises file system shares so I can monitor changes and perform management tasks.
---

# Connect to on-premises file systems from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to access an on-premises file share from a workflow in Azure Logic Apps by using the File System connector. You can then create automated workflows that run when triggered by events in your file share or in other systems, and run actions to manage your files. The connector provides the following capabilities:

- Create, get, append, update, and delete files.
- List files in folders or root folders.
- Get file content and metadata.

In this how-to guide, the example scenarios demonstrate the following tasks:

- Trigger a workflow when a file is created or added to a file share, and then send an email.
- Trigger a workflow when copying a file from a Dropbox account to a file share, and then send an email.

## Limitations and known issues

- The File System connector currently supports only Windows file systems on Windows operating systems.
- Mapped network drives aren't supported.
- For the built-in connector, the root folder must be a top-level file share. The connector doesn't support nested root folder paths. Instead, specify subfolders by using relative paths in connector operations.
- A Standard logic app supports up to 20 built-in File System connections.
- The connector doesn't support multiple built-in connections that use the same root folder with different credentials.

## Connector technical reference

The File System connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
| --- | --- | --- |
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the connector gallery under **Shared**. For more information, review the following documentation: <br><br>- [File System managed connector reference](/connectors/filesystem/) <br>- [Managed connectors in Azure Logic Apps](../connectors/managed.md) |
| **Standard** | Single-tenant Azure Logic Apps in a Workflow Service Plan or App Service Environment v3 (Windows plans only) | Managed connector, which appears in the connector gallery under **Shared**, and built-in connector, which appears in the connector gallery under **Built-In** and is [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can connect directly to a file share and access Azure virtual networks without an on-premises data gateway. <br><br>For more information, see: <br><br>- [File System managed connector reference](/connectors/filesystem/) <br>- [File System built-in connector reference](/azure/logic-apps/connectors/built-in/reference/filesystem/) <br>- [Built-in connectors in Azure Logic Apps](../connectors/built-in.md) |

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- To connect to your file share, different requirements apply, based on your logic app and the hosting environment:

  - Consumption logic app workflows:

    - In multitenant Azure Logic Apps, you need to meet the following requirements, if you haven't already:

      1. [Install an on-premises data gateway on a local computer](../logic-apps/logic-apps-gateway-install.md).

         The **File System** managed connector requires that your gateway installation and file system server must exist in the same Windows domain.

      1. [Connect to on-premises data sources from Azure Logic Apps](../logic-apps/connect-on-premises-data-sources.md).

      1. In the **File System** operation that you added, select the data gateway resource that you previously created.

  - Standard logic app workflows:

    You can use the **File System** built-in connector or managed connector.

    - To use the **File System** managed connector, follow the same requirements as a Consumption logic app workflow in multitenant Azure Logic Apps.

      - To use the **File System** built-in connector, your Standard logic app workflow must run in a Windows-based Workflow Service Plan or App Service Environment v3, but doesn't require the data gateway resource.

      - To route file share traffic through an integrated virtual network, set the `WEBSITE_CONTENTOVERVNET` app setting to `1`, or enable the `vnetContentShareEnabled` site property. Make sure the virtual network can resolve the file server's fully qualified domain name (FQDN) and allows outbound SMB traffic on port 445.

- Access to the computer that has the file system you want to use. For example, if you install the data gateway on the same computer as your file system, you need the account credentials for that computer.

- To follow the example scenario in this guide, you need an email account from a provider that's supported by Azure Logic Apps, such as Office 365 Outlook, Outlook.com, or Gmail. For other providers, [review other supported email connectors](/connectors/connector-reference/connector-reference-logicapps-connectors). This example uses the **Office 365 Outlook** connector with a work or school account. If you use another email account, the overall steps are the same, but your UI might slightly differ.

  > [!IMPORTANT]
  >
  > To use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
  >
  > If you have a Gmail consumer account, you can use this connector only with specific Google-approved services, or you can [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application).
  >
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

- For the example **File System** action scenario, you need a [Dropbox account](https://www.dropbox.com/). You can sign up for free.

- The logic app resource with the workflow where you want to access your file share.

  To start your workflow with a **File System** trigger, you need to have a blank workflow.

  To use a **File System** action, your workflow can start with any trigger that best fits your scenario.

  If you don't have a logic app resource and workflow, see the following articles:

  - [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  - [Create an example Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

<a name="add-file-system-trigger"></a>

## Add a File System trigger

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource. In the designer, open your blank workflow.

1. Add the **File System** trigger for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-trigger) to add a trigger for your workflow.

   For more information, see [File System triggers](/connectors/filesystem/#triggers). This example continues with the trigger named **When a file is created**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, `\PublicShare\MyFileSystem`. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **Gateway** | No | - <*Azure-subscription*> <br><br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the **File System** managed connector trigger:

   :::image type="content" source="media/file-system/file-system-connection-consumption.png" alt-text="Screenshot showing Consumption workflow designer and connection information for File System managed connector trigger." lightbox="media/file-system/file-system-connection-consumption.png":::

1. When you're done, select **Create new**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected trigger.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly created file. Specify the number of files to return and how often you want to check.

      :::image type="content" source="media/file-system/trigger-file-system-when-file-created-consumption.png" alt-text="Screenshot showing Consumption workflow designer and the trigger named When a file is created." lightbox="media/file-system/trigger-file-system-when-file-created-consumption.png":::

   1. To test your workflow, add an Outlook connector action that sends you an email when a file is created on the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/trigger-file-system-send-email-consumption.png" alt-text="Screenshot showing Consumption workflow designer, managed connector trigger named When a file is created, and action named Send an email." lightbox="media/file-system/trigger-file-system-send-email-consumption.png":::

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the trigger's edit boxes. 
      > When the dynamic content list appears, select from the available outputs.

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow sends an email about the new file.

### [Standard](#tab/standard)

#### Built-in connector trigger

The following steps apply only to Standard logic app workflows in a Workflow Service Plan or App Service Environment v3 with Windows plans only.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. In the designer, open your blank workflow.

1. Add the **File System** built-in trigger for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-trigger) to add a trigger for your workflow.

   For more information, see [File System triggers](/azure/logic-apps/connectors/built-in/reference/filesystem/#triggers). This example continues with the trigger named **When a file is added**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The top-level network file share in the format **\\\\<*FQDN-or-IP-address*>\\<*share-name*>**, for example, `\\file-server.contoso.com\MyShare` or `\\10.0.0.4\MyShare`. Don't include a nested folder in the root path. Specify subfolders by using relative paths in the trigger or action. |
   | **Username** | Yes | <*domain-and-username*> | The username for the file share. Use a workstation username or a domain account in the format **<*domain*>\\<*username*>**. |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |

   The following example shows the connection information for the File System built-in connector trigger:

   :::image type="content" source="media/file-system/trigger-file-system-connection-built-in-standard.png" alt-text="Screenshot showing Standard workflow designer and connection information for File System built-in connector trigger." lightbox="media/file-system/trigger-file-system-connection-built-in-standard.png":::

1. When you're done, select **Create new**.

   Azure Logic Apps creates the connection and restarts the logic app to apply the file share mount configuration. Wait for the restart to finish before you save the workflow or add more operations. A successfully created connection doesn't guarantee that the file share mounted successfully. Test the workflow to confirm access.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly added file. Specify how often you want to check.

      :::image type="content" source="media/file-system/trigger-when-file-added-built-in-standard.png" alt-text="Screenshot showing Standard workflow designer and information for the trigger named When a file is added.":::

   1. To test your workflow, add an Outlook action that sends you an email when a file is added to the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/trigger-send-email-built-in-standard.png" alt-text="Screenshot showing Standard workflow designer, managed connector trigger named When a file is added, and action named Send an email." lightbox="media/file-system/trigger-send-email-built-in-standard.png":::

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the trigger's edit boxes. After the dynamic content list and expression editor options appear, select the dynamic content list (lightning icon). When the dynamic content list appears, select from the available outputs.

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow sends an email about the new file.

#### Managed connector trigger

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. In the designer, open your blank workflow.

1. Add the **File System** managed connector trigger for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-trigger) to add a trigger for your workflow.

   For more information, see [File System triggers](/connectors/filesystem/#triggers). This example continues with the trigger named **When a file is created**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, `\PublicShare\MyFileSystem`. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **gateway** | No | - <*Azure-subscription*> <br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the File System managed connector trigger:

   :::image type="content" source="media/file-system/trigger-file-system-connection-managed-standard.png" alt-text="Screenshot showing Standard workflow designer and connection information for File System managed connector trigger." lightbox="media/file-system/trigger-file-system-connection-managed-standard.png":::

1. When you're done, select **Create**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected trigger.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly created file. Specify the number of files to return and how often you want to check.

      :::image type="content" source="media/file-system/trigger-when-file-created-managed-standard.png" alt-text="Screenshot showing Standard workflow designer and managed connector trigger named When a file is created." lightbox="media/file-system/trigger-when-file-created-managed-standard.png":::

   1. To test your workflow, add an Outlook action that sends you an email when a file is created on the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/trigger-send-email-managed-standard.png" alt-text="Screenshot showing Standard workflow designer, managed connector trigger named When a file is created, and action named Send an email." lightbox="media/file-system/trigger-send-email-managed-standard.png":::

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the trigger's edit boxes. 
      > After the dynamic content list and expression editor options appear, select the dynamic content 
      > list (lightning icon). When the dynamic content list appears, select from the available outputs.

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow sends an email about the new file.

---

<a name="add-file-system-action"></a>

## Add a File System action

The example logic app workflow starts with the [Dropbox trigger](/connectors/dropbox/#triggers), but you can use any trigger that you want.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource. In the designer, open your workflow.

1. Add the **File System** action for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-action) to add an action for your workflow.

   For more information, see [File System triggers](/connectors/filesystem/#actions). This example continues with the action named **Create file**.

1. If prompted, provide your connection information. For more information, see the table in the previous section.

1. Continue building your workflow.

   1. Provide the required information for your action.

      For this example, select the folder path on your file system server to use, which is the root folder here. Enter the file name and content, based on the file uploaded to Dropbox.

      :::image type="content" source="media/file-system/action-file-system-create-file-consumption.png" alt-text="Screenshot showing Consumption workflow designer and the File System managed connector action named Create file.":::

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the action's edit boxes. 
      > When the dynamic content list appears, select from the available outputs.

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/trigger-file-system-send-email-consumption.png" alt-text="Screenshot showing Consumption workflow designer, managed connector Create file action, and Send an email action." lightbox="media/file-system/trigger-file-system-send-email-consumption.png":::

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

### [Standard](#tab/standard)

#### Built-in connector action

These steps apply only to Standard logic apps in a Workflow Service Plan or App Service Environment v3 with Windows plans only.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. In the designer, open your workflow.

1. Add the **File System** built-in action for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-action) to add an action for your workflow.

   For more information, see [File System actions](/azure/logic-apps/connectors/built-in/reference/filesystem/#actions). This example continues with the action named **Create file**.

1. If prompted, provide your connection information. For more information, see the table in the [Built-in connector trigger](#built-in-connector-trigger) section.

1. Continue building your workflow.

   1. Provide the required information for your action. For this example, follow these steps:

      1. Enter path and name for the file that you want to create, including the file name extension. Make sure the path is relative to the root folder.

      1. To specify the content from the file created on Dropbox, from the **Add a parameter** list, select **File content**.

      1. After the **File content** parameter appears on the action information pane, select inside the parameter's edit box.

      1. After the dynamic content list and expression editor options appear, select the dynamic content list (lightning icon). From the list that appears, under the **When a file is created** trigger section, select **File Content**.

      When you're done, the **File Content** trigger output appears in the **File content** parameter:

      :::image type="content" source="media/file-system/action-file-system-create-file-built-in-standard.png" alt-text="Screenshot showing Standard workflow designer and the File System built-in connector Create file action." lightbox="media/file-system/action-file-system-create-file-built-in-standard.png":::

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/action-file-system-send-email-built-in-standard.png" alt-text="Screenshot showing Standard workflow designer, built-in connector Create file action, and Send an email action." lightbox="media/file-system/action-file-system-send-email-built-in-standard.png":::

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

#### Managed connector action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. In the designer, open your workflow.

1. Add the **File System** managed connector action for your scenario by following the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-action) to add an action for your workflow.

   For more information, see [File System actions](/connectors/filesystem/#actions). This example continues with the action named **Create file**.

1. If prompted, provide your connection information. For more information, see the table in the [Managed connector trigger](#managed-connector-trigger) section.

1. Continue building your workflow.

   1. Provide the required information for your action. For this example, follow these steps:

      1. Enter path and name for the file that you want to create, including the file name extension. Make sure the path is relative to the root folder.

      1. To specify the content from the file created on Dropbox, from the **Add a parameter** list, select **File content**.

      1. After the **File content** parameter appears on the action information pane, select inside the parameter's edit box.

      1. After the dynamic content list and expression editor options appear, select the dynamic content list (lightning icon). From the list that appears, under the **When a file is created** trigger section, select **File Content**.

      When you're done, the **File Content** trigger output appears in the **File content** parameter:

      :::image type="content" source="media/file-system/action-file-system-create-file-managed-standard.png" alt-text="Screenshot showing Standard workflow designer and the File System managed connector Create file action." lightbox="media/file-system/action-file-system-create-file-managed-standard.png":::

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      :::image type="content" source="media/file-system/action-file-system-send-email-managed-standard.png" alt-text="Screenshot showing Standard workflow designer, managed connector Create file action, and Send an email action." lightbox="media/file-system/action-file-system-send-email-managed-standard.png":::

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

---

## Troubleshoot the built-in File System connector

If an operation fails with the `InvalidServiceProviderConnection` error and reports that a mount path such as `C:\mounts\FileSystem` doesn't exist, the logic app can't mount or access the file share.

Check the following items:

- Confirm that the root folder uses a full UNC path with the file server's FQDN or IP address and a top-level share name, for example, `\\file-server.contoso.com\MyShare`. Don't use only the machine name or include nested folders.
- Confirm that virtual network route tables and network security groups allow SMB traffic from the logic app to the file server on port 445.
- From the logic app's Kudu console, run `nslookup <FQDN>` to confirm that the file server name resolves, and check whether the expected path exists under `C:\mounts`.
- If traffic must use the integrated virtual network, confirm that `WEBSITE_CONTENTOVERVNET` is set to `1` or that the `vnetContentShareEnabled` site property is enabled.
- Confirm that the account has permission to access the top-level share. If the account can access only a nested folder, expose that folder as a separate share and use the new top-level share as the root folder.

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
