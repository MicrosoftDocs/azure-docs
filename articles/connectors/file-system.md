---
title: Connect to on-premises file systems
description: Connect to file systems on premises from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/17/2023
---

# Connect to on-premises file systems from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to access an on-premises file share from a workflow in Azure Logic Apps by using the File System connector. You can then create automated workflows that run when triggered by events in your file share or in other systems and run actions to manage your files. The connector provides the following capabilities:

- Create, get, append, update, and delete files.
- List files in folders or root folders.
- Get file content and metadata.

In this how-to guide, the example scenarios demonstrate the following tasks:

- Trigger a workflow when a file is created or added to a file share, and then send an email.
- Trigger a workflow when copying a file from a Dropbox account to a file share, and then send an email.

## Limitations and known issues

- The File System connector currently supports only Windows file systems on Windows operating systems.
- Mapped network drives aren't supported.

## Connector technical reference

The File System connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector, which appears in the designer under the **Standard** label. For more information, review the following documentation: <br><br>- [File System managed connector reference](/connectors/filesystem/) <br>- [Managed connectors in Azure Logic Apps](../connectors/managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector, which appears in the designer under the **Standard** label, and the ISE version, which has different message limits than the Standard class. For more information, review the following documentation: <br><br>- [File System managed connector reference](/connectors/filesystem/) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](../connectors/managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**, and the built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in connector differs in the following ways: <br><br>- The built-in connector supports only Standard logic apps that run in an App Service Environment v3 with Windows plans only. <br><br>- The built-in version can connect directly to a file share and access Azure virtual networks by using a connection string without an on-premises data gateway. <br><br>For more information, review the following documentation: <br><br>- [File System managed connector reference](/connectors/filesystem/) <br>- [File System built-in connector reference](/azure/logic-apps/connectors/built-in/reference/filesystem/) <br>- [Built-in connectors in Azure Logic Apps](../connectors/built-in.md) |

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* To connect to your file share, different requirements apply, based on your logic app and the hosting environment:

  - Consumption logic app workflows

    - In multi-tenant Azure Logic Apps, you need to meet the following requirements, if you haven't already:
    
      1. [Install the on-premises data gateway on a local computer](../logic-apps/logic-apps-gateway-install.md).

         The File System managed connector requires that your gateway installation and file system server must exist in the same Windows domain.

      1. [Create an on-premises data gateway resource in Azure](../logic-apps/logic-apps-gateway-connection.md).

      1. After you add a File System managed connector trigger or action to your workflow, select the data gateway resource that you previously created so you can connect to your file system.

    - In an ISE, you don't need the on-premises data gateway. Instead, you can use the ISE-versioned File System connector.

  - Standard logic app workflows

    You can use the File System built-in connector or managed connector.

    * To use the File System managed connector, follow the same requirements as a Consumption logic app workflow in multi-tenant Azure Logic Apps.

    * To use the File System built-in connector, your Standard logic app workflow must run in App Service Environment v3, but doesn't require the data gateway resource.

* Access to the computer that has the file system you want to use. For example, if you install the data gateway on the same computer as your file system, you need the account credentials for that computer.

* To follow the example scenario in this how-to guide, you need an email account from a provider that's supported by Azure Logic Apps, such as Office 365 Outlook, Outlook.com, or Gmail. For other providers, [review other supported email connectors](/connectors/connector-reference/connector-reference-logicapps-connectors). This example uses the Office 365 Outlook connector with a work or school account. If you use another email account, the overall steps are the same, but your UI might slightly differ.

  > [!IMPORTANT]
  >
  > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
  > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* For the example File System action scenario, you need a [Dropbox account](https://www.dropbox.com/), which you can sign up for free.

* The logic app workflow where you want to access your file share. To start your workflow with a File System trigger, you have to start with a blank workflow. To add a File System action, start your workflow with any trigger.

<a name="add-file-system-trigger"></a>

## Add a File System trigger

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your blank logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** trigger that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

   For more information, see [File System triggers](/connectors/filesystem/#triggers). This example continues with the trigger named **When a file is created**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. <br><br>- For the ISE-based File System connector, use the forward slash instead (**`/`**): <br><br>- **<*domain*>/<*username*>** <br>- **<*local-computer*>/<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **gateway** | No | - <*Azure-subscription*> <br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the File System managed connector trigger:

   ![Screenshot showing Consumption workflow designer and connection information for File System managed connector trigger.](media/connect-file-systems/file-system-connection-consumption.png)

   The following example shows the connection information for the File System ISE-based trigger:

   ![Screenshot showing Consumption workflow designer and connection information for File System ISE-based connector trigger.](media/connect-file-systems/file-system-connection-ise.png)

1. When you're done, select **Create**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected trigger.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly created file. Specify the number of files to return and how often you want to check.

      ![Screenshot showing Consumption workflow designer and the trigger named When a file is created.](media/connect-file-systems/trigger-file-system-when-file-created-consumption.png)

   1. To test your workflow, add an Outlook action that sends you an email when a file is created on the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Consumption workflow designer, managed connector trigger named When a file is created, and action named Send an email.](media/connect-file-systems/trigger-file-system-send-email-consumption.png)

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the trigger's edit boxes. 
      > When the dynamic content list appears, select from the available outputs.

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow sends an email about the new file.

### [Standard](#tab/standard)

#### Built-in connector trigger

The following steps apply only to Standard logic app workflows in an App Service Environment v3 with Windows plans only.

1. In the [Azure portal](https://portal.azure.com), open your blank logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** built-in trigger that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   For more information, see [File System triggers](/azure/logic-apps/connectors/built-in/reference/filesystem/#triggers). This example continues with the trigger named **When a file is added**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |

   The following example shows the connection information for the File System built-in connector trigger:

   ![Screenshot showing Standard workflow designer and connection information for File System built-in connector trigger.](media/connect-file-systems/trigger-file-system-connection-built-in-standard.png)

1. When you're done, select **Create**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected trigger.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly added file. Specify how often you want to check.

      ![Screenshot showing Standard workflow designer and information for the trigger named When a file is added.](media/connect-file-systems/trigger-when-file-added-built-in-standard.png)

   1. To test your workflow, add an Outlook action that sends you an email when a file is added to the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Standard workflow designer, managed connector trigger named When a file is added, and action named Send an email.](media/connect-file-systems/trigger-send-email-built-in-standard.png)

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the trigger's edit boxes. 
      > After the dynamic content list and expression editor options appear, select the dynamic content 
      > list (lightning icon). When the dynamic content list appears, select from the available outputs.

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow sends an email about the new file.

#### Managed connector trigger

1. In the [Azure portal](https://portal.azure.com), open your blank logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** managed trigger that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   For more information, see [File System triggers](/connectors/filesystem/#triggers). This example continues with the trigger named **When a file is created**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. <br><br>- For the ISE-based File System connector, use the forward slash instead (**`/`**): <br><br>- **<*domain*>/<*username*>** <br>- **<*local-computer*>/<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **gateway** | No | - <*Azure-subscription*> <br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the File System managed connector trigger:

   ![Screenshot showing Standard workflow designer and connection information for File System managed connector trigger.](media/connect-file-systems/trigger-file-system-connection-managed-standard.png)

1. When you're done, select **Create**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected trigger.

1. Continue building your workflow.

   1. Provide the required information for your trigger.

      For this example, select the folder path on your file system server to check for a newly created file. Specify the number of files to return and how often you want to check.

      ![Screenshot showing Standard workflow designer and managed connector trigger named When a file is created.](media/connect-file-systems/trigger-when-file-created-managed-standard.png)

   1. To test your workflow, add an Outlook action that sends you an email when a file is created on the file system in specified folder. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Standard workflow designer, managed connector trigger named When a file is created, and action named Send an email.](media/connect-file-systems/trigger-send-email-managed-standard.png)

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

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** action that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   For more information, see [File System triggers](/connectors/filesystem/#actions). This example continues with the action named **Create file**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. <br><br>- For the ISE-based File System connector, use the forward slash instead (**`/`**): <br><br>- **<*domain*>/<*username*>** <br>- **<*local-computer*>/<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **gateway** | No | - <*Azure-subscription*> <br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the File System managed connector action:

   ![Screenshot showing connection information for File System managed connector action.](media/connect-file-systems/file-system-connection-consumption.png)

   The following example shows the connection information for the File System ISE-based connector action:

   ![Screenshot showing connection information for File System ISE-based connector action.](media/connect-file-systems/file-system-connection-ise.png)

1. When you're done, select **Create**.

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected action.

1. Continue building your workflow.

   1. Provide the required information for your action.

      For this example, select the folder path on your file system server to use, which is the root folder here. Enter the file name and content, based on the file uploaded to Dropbox.

      ![Screenshot showing Consumption workflow designer and the File System managed connector action named Create file.](media/connect-file-systems/action-file-system-create-file-consumption.png)

      > [!TIP]
      >
      > To add outputs from previous steps in the workflow, select inside the action's edit boxes. 
      > When the dynamic content list appears, select from the available outputs.

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Consumption workflow designer, managed connector "Create file" action, and "Send an email" action.](media/connect-file-systems/action-file-system-send-email-consumption.png)

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

### [Standard](#tab/standard)

#### Built-in connector action

These steps apply only to Standard logic apps in an App Service Environment v3 with Windows plans only.

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** action that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

   For more information, see [File System actions](/azure/logic-apps/connectors/built-in/reference/filesystem/#actions). This example continues with the action named **Create file**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |

   The following example shows the connection information for the File System built-in connector action:

   ![Screenshot showing Standard workflow designer and connection information for File System built-in connector action.](media/connect-file-systems/action-file-system-connection-built-in-standard.png)

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected action.

1. Continue building your workflow.

   1. Provide the required information for your action. For this example, follow these steps:

      1. Enter path and name for the file that you want to create, including the file name extension. Make sure the path is relative to the root folder.

      1. To specify the content from the file created on Dropbox, from the **Add a parameter** list, select **File content**.

      1. After the **File content** parameter appears on the action information pane, select inside the parameter's edit box.

      1. After the dynamic content list and expression editor options appear, select the dynamic content list (lightning icon). From the list that appears, under the **When a file is created** trigger section, select **File Content**.

      When you're done, the **File Content** trigger output appears in the **File content** parameter:

      ![Screenshot showing Standard workflow designer and the File System built-in connector "Create file" action.](media/connect-file-systems/action-file-system-create-file-built-in-standard.png)

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Standard workflow designer, built-in connector "Create file" action, and "Send an email" action.](media/connect-file-systems/action-file-system-send-email-built-in-standard.png)

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

#### Managed connector action

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **File System** action that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

   For more information, see [File System actions](/connectors/filesystem/#actions). This example continues with the action named **Create file**.

1. In the connection information box, provide the following information as required:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | The name to use for your connection |
   | **Root folder** | Yes | <*root-folder-name*> | The root folder for your file system, which is usually the main parent folder and is the folder used for the relative paths with all triggers that work on files. <br><br>For example, if you installed the on-premises data gateway, use the local folder on the computer with the data gateway installation. Or, use the folder for the network share where the computer can access that folder, for example, **`\\PublicShare\\MyFileSystem`**. |
   | **Authentication Type** | No | <*auth-type*> | The type of authentication that your file system server uses, which is **Windows** |
   | **Username** | Yes | <*domain-and-username*> | The domain and username for the computer where you have your file system. <br><br>For the managed File System connector, use one of the following values with the backslash (**`\`**): <br><br>- **<*domain*>\\<*username*>** <br>- **<*local-computer*>\\<*username*>** <br><br>For example, if your file system folder is on the same computer as the on-premises data gateway installation, you can use **<*local-computer*>\\<*username*>**. <br><br>- For the ISE-based File System connector, use the forward slash instead (**`/`**): <br><br>- **<*domain*>/<*username*>** <br>- **<*local-computer*>/<*username*>** |
   | **Password** | Yes | <*password*> | The password for the computer where you have your file system |
   | **gateway** | No | - <*Azure-subscription*> <br>- <*gateway-resource-name*> | This section applies only to the managed File System connector: <br><br>- **Subscription**: The Azure subscription associated with the data gateway resource <br>- **Connection Gateway**: The data gateway resource |

   The following example shows the connection information for the File System managed connector action:

   ![Screenshot showing connection information for File System managed connector action.](media/connect-file-systems/action-file-system-connection-managed-standard.png)

   Azure Logic Apps creates and tests your connection, making sure that the connection works properly. If the connection is set up correctly, the setup options appear for your selected action.

1. Continue building your workflow.

   1. Provide the required information for your action. For this example, follow these steps:

      1. Enter path and name for the file that you want to create, including the file name extension. Make sure the path is relative to the root folder.

      1. To specify the content from the file created on Dropbox, from the **Add a parameter** list, select **File content**.

      1. After the **File content** parameter appears on the action information pane, select inside the parameter's edit box.

      1. After the dynamic content list and expression editor options appear, select the dynamic content list (lightning icon). From the list that appears, under the **When a file is created** trigger section, select **File Content**.

      When you're done, the **File Content** trigger output appears in the **File content** parameter:

      ![Screenshot showing Standard workflow designer and the File System managed connector "Create file" action.](media/connect-file-systems/action-file-system-create-file-managed-standard.png)

   1. To test your workflow, add an Outlook action that sends you an email when the File System action creates a file. Enter the email recipients, subject, and body. For testing, you can use your own email address.

      ![Screenshot showing Standard workflow designer, managed connector "Create file" action, and "Send an email" action.](media/connect-file-systems/action-file-system-send-email-managed-standard.png)

1. When you're done, save your workflow.

1. To test your workflow, upload a file, which triggers the workflow.

If successful, your workflow creates a file on your file system server, based on the uploaded file in DropBox, and sends an email about the created file.

---

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
