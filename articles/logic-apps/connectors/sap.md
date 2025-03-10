---
title: Connect to SAP
description: Connect to an SAP server from a workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: daviburg
ms.author: daviburg
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/16/2025
---

# Connect to SAP from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../../includes/logic-apps-sku-consumption-standard.md)]

This multipart how-to guide shows how to access your SAP server from a workflow in Azure Logic Apps using the SAP connector. You can use the SAP connector's operations to create automated workflows that run when triggered by events in your SAP server or in other systems and run actions to manage resources on your SAP server.

Both Standard and Consumption logic app workflows offer the SAP *managed* connector that's hosted and run in multitenant Azure. Standard workflows also offer the SAP *built-in* connector that's hosted and run in single-tenant Azure Logic Apps. For more information, see [Connector technical reference](#connector-technical-reference).

## SAP compatibility

The SAP connector is compatible with the following types of SAP systems:

* On-premises and cloud-based HANA-based SAP systems, such as S/4 HANA.

* Classic on-premises SAP systems, such as R/3 and ECC.

SAP must support the SAP system version that you want to connect. Otherwise, any issues that you might encounter might not be resolvable. For more information about SAP system versions and maintenance information, review the [SAP Product Availability Matrix (PAM)](http://support.sap.com/pam).

The SAP connector supports the following message and data integration types from SAP NetWeaver-based systems:

* Intermediate Document (IDoc)

* Business Application Programming Interface (BAPI)

* Remote Function Call (RFC) and Transactional RFC (tRFC)

The SAP connector uses the [SAP .NET Connector (NCo) library](https://support.sap.com/en/product/connectors/msnet.html).

To use the SAP connector operations, you have to first authenticate your connection and have the following options:

* You can provide a username and password.

* The SAP connector supports authentication with [SAP Secure Network Communications (SNC)](https://help.sap.com/docs/r/e73bba71770e4c0ca5fb2a3c17e8e229/7.31.25/en-US/e656f466e99a11d1a5b00000e835363f.html).

You can use SNC for SAP NetWeaver single sign-on (SSO) or for security capabilities from external products. If you choose to use SNC, review the [SNC prerequisites](#snc-prerequisites).

## Connector technical reference

The SAP connector has different versions, based on [logic app type and host environment](../logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**. For more information, review the following documentation: <br><br>- [SAP managed connector reference](/connectors/sap/) <br>- [Managed connectors in Azure Logic Apps](../../connectors/managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**, and the built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks with a connection string without an on-premises data gateway. For more information, review the following documentation: <br><br>- [SAP managed connector reference](/connectors/sap/) <br>- [SAP built-in connector reference](/azure/logic-apps/connectors/built-in/reference/sap/) <br><br>- [Managed connectors in Azure Logic Apps](../../connectors/managed.md) <br>- [Built-in connectors in Azure Logic Apps](../../connectors/built-in.md) |

## Connector differences

The SAP built-in connector significantly differs from the SAP managed connector in the following ways:

* On-premises connections don't require the on-premises data gateway.

  Instead, the SAP built-in connector communicates directly with your SAP server in the integrated virtual network, which avoids hops, latency, and failure points for a network gateway. Make sure that you upload or deploy the non-redistributable SAP client libraries with your logic app workflow application. For more information, see the [Prerequisites](#prerequisites) in this guide.

* Payload sizes up to 100 MB are supported, so you don't have to use a blob URI for large requests.

* Specific actions are available for **Call BAPI**, **Call RFC**, and **Send IDoc**. These dedicated actions provide a better experience for stateful BAPIs, RFC transactions, and IDoc deduplication, and don't use the older SOAP Windows Communication Foundation (WCF) messaging model.

  The **Call BAPI** action includes up to two responses with the returned JSON, the XML response from the called BAPI, and the BAPI commit or BAPI rollback response as well and if you use auto-commit. This capability addresses the problem with the SAP managed connector where the outcome from the auto-commit is silent and observable only through logs.

* Longer time-out at 5 minutes compared to managed connector.

  The SAP built-in connector doesn't use the shared or global connector infrastructure, which means time-outs are longer at 5 minutes compared to the SAP managed connector (two minutes). Long-running requests work without you having to implement the long-running webhook-based request action pattern.

* By default, the SAP built-in connector operations are *stateless*. However, you can [enable stateful mode (affinity) for these operations](../../connectors/enable-stateful-affinity-built-in-connectors.md).

  In stateful mode, the SAP built-in connector supports high availability and horizontal scale-out configurations. By comparison, the SAP managed connector has restrictions regarding the on-premises data gateway limited to a single instance for triggers and to clusters only in failover mode for actions. For more information, see [SAP managed connector - Known issues and limitations](#known-issues-limitations).

* Standard logic app workflows require and use the SAP NCo 3.1 client library, not the SAP NCo 3.0 version. For more information, see [Prerequisites](#prerequisites).

* Standard logic app workflows provide application settings where you can specify a Personal Security Environment (PSE) and PSE password.

  This change prevents you from uploading multiple PSE files, which isn't supported and results in SAP connection failures. In Consumption logic app workflows, the SAP managed connector lets you specify these values through connection parameters, which allowed you to upload multiple PSE files and isn't supported, causing SAP connection failures.

* **Generate Schema** action

  * You can select from multiple operation types, such as BAPI, IDoc, RFC, and tRFC, versus the same action in the SAP managed connector, which uses the **SapActionUris** parameter and a file system picker experience.

  * You can directly provide a parameter name as a custom value. For example, you can specify the **RFC Name** parameter from the **Call RFC** action. By comparison, in the SAP managed connector, you had to provide a complex **Action URI** parameter name.

  * By design, this action doesn't support generating multiple schemas for RFCs, BAPIs, or IDocs in single action execution, which the SAP managed connector supports. This capability change now prevents attempts to send large amounts of content in a single call.

<a name="connector-parameters"></a>

## Connector parameters

Along with simple string and number inputs, the SAP connector accepts the following table parameters (`Type=ITAB` inputs):

* Table direction parameters, both input and output, for older SAP releases.
* Parameter changes, which replace the table direction parameters for newer SAP releases.
* Hierarchical table parameters.

<a name="known-issues-limitations"></a>

## Known issues and limitations

### SAP managed connector

* The SAP connector currently doesn't support SAP router strings. The on-premises data gateway must exist on a virtual network where the gateway can directly reach the SAP system that you want to connect.

* In general, the SAP trigger doesn't support data gateway clusters. In some failover cases, the data gateway node that communicates with the SAP system might differ from the active node, which results in unexpected behavior.

  * For send message scenarios, data gateway clusters in failover mode are supported.

  * Stateful [SAP actions](/connectors/sap/#actions) don't support data gateway clusters in load-balancing mode. Stateful communications must remain on the same data gateway cluster node. Either use the data gateway in non-cluster mode or in a cluster that's set up for failover only. For example, these actions include the following:

    * All actions that specify a **Session ID** value
    * **\[BAPI] Commit transaction**
    * **\[BAPI] Rollback transaction**
    * **\[BAPI - RFC] Close stateful session**
    * **\[BAPI - RFC] Create stateful session**

* In the action named **\[BAPI] Call method in SAP**, the auto-commit feature won't commit the BAPI changes if at least one warning exists in the **CallBapiResponse** object returned by the action. To commit BAPI changes despite any warnings, follow these steps:

  1. Create a session explicitly using the action named **\[BAPI - RFC] Create stateful session**.
  1. In the action named **\[BAPI] Call method in SAP**, disable the auto-commit feature.
  1. Call the action named **\[BAPI] Commit transaction** instead.

### IP-based connections to SAP Message Server (load-balanced configuration)

If you specify an IP address to connect to an SAP Message Server, for example, a load balancer, the connection might still fail with an error message similar to **"hostname SAPDBSERVER01.example.com unknown"**. The message server instructs the SAP connector to use a hostname for the connection to the backend SAP Application Server, or the server behind the load balancer. If DNS can't resolve the hostname, the connection fails.

For this problem, the following workarounds or solutions exist:

- Make sure that the client making the connection, such as the computer with the on-premises data gateway for the SAP connector, can resolve the hostnames returned by the message server.

- In the transaction named **RZ11**, change or add the SAP setting named **ms/lg_with_hostname=0**.

#### Problem context or background

SAP upgraded their .NET connector (NCo) to version 3.1, which changed the way that the connector requests connections to backend servers from message servers. The connector now uses a new API for application server resolution by the message server unless you force the connector to use the previous API through the setting named **ms/lg_with_hostname=0`**. For more information, see [SAP KB Article 3305039 - SMLG IP Address setting not considered during Logon Group login](https://me.sap.com/notes/3305039/E).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The [SAP Application server](https://wiki.scn.sap.com/wiki/display/ABAP/ABAP+Application+Server) or [SAP Message server](https://help.sap.com/docs/SAP_NETWEAVER_700?version=7.0.37&locale=en-US&state=PRODUCTION) that you want to access from Azure Logic Apps.

  * Set up your SAP server and user account to allow using RFC.

    For more information, which includes the supported user account types and the minimum required authorization for each action type (RFC, BAPI, IDoc), review the following SAP note: [460089 - Minimum authorization profiles for external RFC programs](https://launchpad.support.sap.com/#/notes/460089).

  * Your SAP user account needs access to the `RFC_METADATA` function group and the respective function modules for the following operations:

    | Operations | Access to function modules |
    |------------|----------------------------|
    | RFC actions | `RFC_GROUP_SEARCH` and `DD_LANGU_TO_ISOLA` |
    | BAPI actions | `BAPI_TRANSACTION_COMMIT`, `BAPI_TRANSACTION_ROLLBACK`, `RPY_BOR_TREE_INIT`, `SWO_QUERY_METHODS`, and `SWO_QUERY_API_METHODS` |
    | IDoc actions | `IDOCTYPES_LIST_WITH_MESSAGES`, `IDOCTYPES_FOR_MESTYPE_READ`, `INBOUND_IDOCS_FOR_TID`, `OUTBOUND_IDOCS_FOR_TID`, `GET_STATUS_FROM_IDOCNR`, and `IDOC_RECORD_READ` |
    | [**Read SAP table**](/connectors/sap/#read-sap-table) action | Either `RFC BBP_RFC_READ_TABLE` or `RFC_READ_TABLE` |
    | Grant strict minimum access to SAP server for your SAP connection | `RFC_METADATA_GET` and `RFC_METADATA_GET_TIMESTAMP` |

* The logic app workflow from where you want to access your SAP server.

  * For a Consumption workflow in multitenant Azure Logic Apps, see [Multitenant prerequisites](#multitenant-prerequisites).

  * For a Standard workflow in single-tenant Azure Logic Apps, see [Single-tenant prerequisites](#single-tenant-prerequisites).

* By default, the SAP built-in connector operations are *stateless*. To run these operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](../../connectors/enable-stateful-affinity-built-in-connectors.md).

* To use either the SAP managed or built-in connector trigger named **When a message is received**, complete the following tasks:

  * Set up your SAP gateway security permissions or Access Control List (ACL). In the **Gateway Monitor** (T-Code SMGW) dialog box, which shows the **secinfo** and **reginfo** files, open the **Goto** menu, and select **Expert Functions** > **External Security** > **Maintenance of ACL Files**.

    The following permission setting is required:

    `P TP=LOGICAPP HOST=<on-premises-gateway-server-IP-address> ACCESS=*`

    This line has the following format:

    `P TP=<trading-partner-identifier-(program-name)-or-*-for-all-partners> HOST=<comma-separated-list-with-external-host-IP-or-network-names-that-can-register-the-program> ACCESS=<*-for-all-permissions-or-a-comma-separated-list-of-permissions>`

    If you don't configure the SAP gateway security permissions, you might receive the following error:

    **Registration of tp Microsoft.PowerBI.EnterpriseGateway from host <*host-name*> not allowed**

    For more information, review [SAP Note 1850230 - GW: "Registration of tp \<program ID\> not allowed"](https://userapps.support.sap.com/sap/support/knowledge/1850230).

  * Set up your SAP gateway security logging to help find Access Control List (ACL) issues. For more information, review the [SAP help topic for setting up gateway logging](https://help.sap.com/docs/r/62b4de4187cb43668d15dac48fc00732/7.31.25/en-US/48b2a710ca1c3079e10000000a42189b.html).

  * In the **Configuration of RFC Connections** (T-Code SM59) dialog box, create an RFC connection with the **TCP/IP** type. Make sure that the **Activation Type** is set to **Registered Server Program**. Set the RFC connection's **Communication Type with Target System** value to **Unicode**.

  * If you use this SAP trigger with the **IDOC Format** parameter set to **FlatFile** along with the [Flat File Decode action](../logic-apps-enterprise-integration-flatfile.md), you have to use the `early_terminate_optional_fields` property in your flat file schema by setting the value to `true`.

    This requirement is necessary because the flat file IDoc data record that's sent by SAP on the tRFC call `IDOC_INBOUND_ASYNCHRONOUS` isn't padded to the full SDATA field length. Azure Logic Apps provides the flat file IDoc original data without padding as received from SAP. Also, when you combine this SAP trigger with the **Flat File Decode** action, the schema that's provided to the action must match.

  * In Consumption and Standard workflows, the SAP managed trigger named **When a message is received** uses the same URI location to both renew and unsubscribe from a webhook subscription. The renewal operation uses the HTTP `PATCH` method, while the unsubscribe operation uses the HTTP `DELETE` method. This behavior might make a renewal operation appear as an unsubscribe operation in your trigger's history, but the operation is still a renewal because the trigger uses `PATCH` as the HTTP method, not `DELETE`.

    In Standard workflows, the SAP built-in trigger named **When a message is received** uses the Azure Functions trigger instead, and shows only the actual callbacks from SAP.

  * For the SAP built-in connector trigger named **When a message is received**, you have to enable virtual network integration and private ports by following the article at [Enabling Service Bus and SAP built-in connectors for stateful Logic Apps in Standard](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/enabling-service-bus-and-sap-built-in-connectors-for-stateful/ba-p/3820381). You can also run the workflow in Visual Studio Code to fire the trigger locally. For Visual Studio Code setup requirements and more information, see [Create a Standard logic app workflow in single-tenant Azure Logic Apps using Visual Studio Code](../create-single-tenant-workflows-visual-studio-code.md). You must also set up the following environment variables on the computer where you install Visual Studio Code:
 
   - **WEBSITE_PRIVATE_IP**: Set this environment variable value to **127.0.0.1** as the localhost address. 
   - **WEBSITE_PRIVATE_PORTS**: Set this environment variable value to two free and usable ports on your local computer, separating the values with a comma (**,**), for example, **8080,8088**.

* The message content to send to your SAP server, such as a sample IDoc file. This content must be in XML format and include the namespace of the [SAP action](/connectors/sap/#actions) that you want to use. You can [send IDocs with a flat file schema by wrapping them in an XML envelope](sap-create-example-scenario-workflows.md#send-flat-file-idocs).

* For scenarios where you want to send IDocs from your logic app workflow to SAP, change your SAP processing mode from the default **Trigger immediately** setting to **Trigger by background program** so that your workflow doesn't time out.

  If your SAP system is under load, for example, when your workflow sends a batch of IDocs all at one time to SAP, the queued IDoc calls time out. The default processing mode causes your SAP system to block the inbound call for IDoc transmission until an IDoc finishes processing. In Azure Logic Apps, workflow actions have a 2-minute time-out, by default.

  To change your SAP system's processing mode, follow these steps:

  1. In SAP, find the SAP partner profile, and open the **Partner profiles** settings. You can use the **we20** transaction code (T-Code) with the **/n** prefix.

  1. On the **Inbound options** tab, under **Processing by Function Module**, change the setting to **Trigger by background program** from **Trigger immediately**.

     The **Trigger by background program** setting lets the underlying IDoc transport tRFC call **`IDOC_INBOUND_ASYNCHRONOUS`** to complete immediately, rather than block the connection until the IDoc finishes processing. However, this setting works only if the IDoc doesn't include the [Express behavior overwriting segment, per SAP Support Note 1777090 - IDocs are processed immediately despite having the "Trigger by background program" option selected in WE20 - SAP for Me](https://me.sap.com/notes/0001777090).

  For more information, see the following resources:

  - [SAP Support Note 1845390 - Poor performance when posting IDocs with report RBDAPP01 - SAP for Me](https://me.sap.com/notes/1845390/E)
  - [SAP Support Note 1333417 - Performance problems when processing IDocs immediately - SAP for Me](https://me.sap.com/notes/1333417/E)

<a name="network-prerequisites"></a>

### Network connectivity prerequisites

The SAP system requires network connectivity from the host of the SAP .NET Connector (NCo) library:

* For Consumption logic app workflows in multitenant Azure Logic Apps, the on-premises data gateway hosts the SAP .NET Connector (NCo) library. If you use an on-premises data gateway cluster, all nodes of the cluster require network connectivity to the SAP system.

* For Standard logic app workflows in single-tenant Azure Logic Apps, the logic app resource hosts the SAP .NET Connector (NCo) library. So, the logic app resource itself must enable virtual network integration, and that virtual network must have network connectivity to the SAP system.

The SAP system-required network connectivity includes the following servers and services:

* SAP Application Server, Dispatcher service (for all Logon types)

  Your SAP system can include multiple SAP Application Servers. The host of the SAP .NET Connector (NCo) library requires access to each server and their services.

* SAP Message Server, Message service (for Logon type Group)

  The Message Server and service will redirect to one or more Application Server's Dispatcher services. The host of the SAP .NET Connector (NCo) library requires access to each server and their services.

* SAP Gateway Server, Gateway service

* SAP Gateway Server, Gateway secured service

  The SAP system-required network connectivity also includes this server and service to use with Secure Network Communications (SNC).

Redirection of requests from Application Server, Dispatcher service to Gateway Server, Gateway service automatically happens within the SAP .NET Connector (NCo) library. This redirection occurs even if only the Application Server, Dispatcher service information is provided in the connection parameters.

If you're using a load balancer in front of your SAP system, you must redirect all the services to their respective servers. 
For more information about SAP services and ports, review the [TCP/IP Ports of All SAP Products](https://help.sap.com/docs/Security/575a9f0e56f34c6e8138439eefc32b16).

> [!NOTE]
>
> Make sure you enabled network connectivity from the host of the SAP .NET Connector (NCo) library and that the required 
> ports are open on firewalls and network security groups. Otherwise, you get errors such as **partner not reached** 
> from the **NI (network interface)** component and error text such as **WSAECONNREFUSED: Connection refused**.

<a name="sap-client-library-prerequisites"></a>

### SAP NCo client library prerequisites

To use the SAP connector, you have to install the SAP Connector NCo client library for Microsoft .NET 3.1. The following list describes the prerequisites for the SAP NCo client library, based on the workflow where you're using the SAP connector:

* Version:

  * For Consumption logic app workflows that use the on-premises data gateway, make sure that you install the latest 64-bit version, [SAP Connector for Microsoft .NET 3.1.3.0 for Windows 64bit (x64)](https://support.sap.com/en/product/connectors/msnet.html). The data gateway runs only on 64-bit systems. Installing the unsupported 32-bit version results in a **"bad image"** error.
    
  * For Standard logic app workflows, you can install the latest 64-bit or 32-bit version for [SAP Connector (NCo 3.1) for Microsoft .NET 3.1.3.0 compiled with .NET Framework 4.6.2](https://support.sap.com/en/product/connectors/msnet.html). However, make sure that you install the version that matches the configuration in your Standard logic app resource. To check the version used by your logic app, follow these steps:

    1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

    1. On the logic app resource menu, under **Settings**, select **Configuration**.

    1. On the **Configuration** page, select the **General settings** tab. Under **Platform settings**, check whether the **Platform** value is set to **64 Bit** or **32 Bit**.

    1. Make sure to install the version of the [SAP Connector (NCo 3.1) for Microsoft .NET 3.1.3.0 compiled with .NET Framework 4.6.2](https://support.sap.com/en/product/connectors/msnet.html) that matches your platform configuration.

* From the client library's default installation folder, copy the assembly (.dll) files to another location, based on your scenario as follows. Or, optionally, if you're using only the SAP managed connector, when you install the SAP NCo client library, select **Global Assembly Cache registration**. The SAP built-in connector currently doesn't support GAC registration.

  * For a Consumption workflow that runs in multitenant Azure Logic Apps and uses your on-premises data gateway, copy the following assembly (.dll) files to the on-premises data gateway installation folder, for example, **C:\Program Files\On-Premises Data Gateway**. The SAP NCo 3.0 client library contains the following assemblies:

    - **libicudecnumber.dll**
    - **rscp4n.dll**
    - **sapnco.dll**
    - **sapnco_utils.dll**

    Make sure that you copy the assembly files to the data gateway's *installation folder*. Otherwise, your SAP connection might fail with the error message, **Please check your account info and/or permissions and try again**. You can troubleshoot further issues using the [.NET assembly binding log viewer](/dotnet/framework/tools/fuslogvw-exe-assembly-binding-log-viewer). This tool lets you check that your assembly files are in the correct location.

  * For Standard workflows, copy the following assembly (.dll) files to a location from where you can upload them to your logic app resource or project where you're building your workflow, either in the Azure portal or locally in Visual Studio Code, respectively. The SAP NCo 3.1 client library includes the following assemblies:

    - **rscp4n.dll**
    - **sapnco.dll**
    - **sapnco_utils.dll**

The following relationships exist between the SAP NCo client library, the .NET Framework, the .NET runtime, and the data gateway:

* The Microsoft SAP Adapter and the gateway host service both use .NET Framework 4.7.2.

* The SAP NCo for .NET Framework 4.0 works with processes that use .NET runtime 4.0 to 4.8.

* The SAP NCo for .NET Framework 2.0 works with processes that use .NET runtime 2.0 to 3.5, but no longer works with the latest gateway.

<a name="snc-prerequisites"></a>

### SNC prerequisites

### [Consumption](#tab/consumption)

<a name="snc-prerequisites-consumption"></a>

For Consumption workflows in multitenant Azure Logic Apps that use the on-premises data gateway, and optionally SNC, you must also configure the following settings.

* Make sure that your SNC library version and its dependencies are compatible with your SAP environment. To troubleshoot any library compatibility issues, you can use your on-premises data gateway and data gateway logs. 

* Make sure that you copied the following assembly (.dll) files in the SAP NCo 3.0 client library to the on-premises data gateway's *installation* folder, for example, **C:\Program Files\On-Premises Data Gateway**.

  - **libicudecnumber.dll**
  - **rscp4n.dll**
  - **sapnco.dll**
  - **sapnco_utils.dll**

* For the SAPGENPSE utility, you must specifically use **sapgenpse.exe**.

* If you provide a Personal Security Environment (PSE) with your connection, you don't need to copy and set up the PSE and SECUDIR for your on-premises data gateway.

* If you enable SNC through an external security product, such as [sapseculib](https://help.sap.com/docs/SAP_NETWEAVER_740/f1cccec432514a3181f2852f2b91d306/7a0755dc6ef84f76890a77ad6eb13b13.html?version=7.4.23&locale=en-US&state=PRODUCTION), Kerberos, or NTLM, make sure that the SNC library exists on the same computer as your data gateway installation. For this task, copy the SNC library's binary files to the same folder as the data gateway installation on your local computer, for example, **C:\Program Files\On-Premises Data Gateway**.

  > [!NOTE]
  >
  > On the computer with the data gateway installation and SNC library, don't set the 
  > environment variables for **SNC_LIB** and **SNC_LIB_64**. Otherwise, these variables 
  > take precedence over the SNC library value passed through the connector.

* To use SNC with single sign-on (SSO), make sure the data gateway service is running as a user who is mapped to an SAP user. To change the default account for the gateway service account, select **Change account**, and enter the user credentials.

  ![Screenshot that shows the on-premises data gateway installer and Service Settings page with button to change gateway service account selected.](./media/sap/gateway-account.png)

For more information about enabling SNC, review [Enable Secure Network Communications (SNC)](#enable-secure-network-communications).

### [Standard](#tab/standard)

<a name="snc-prerequisites-standard"></a>

The SAP built-in connector supports only SNC X.509 authentication, not single sign-on (SSO) authentication. Make sure that you install the SNC and common crypto library assemblies as part of your [single-tenant prerequisites](#single-tenant-prerequisites) and [network connectivity prerequisites](#network-prerequisites). For more information about enabling SNC, review [Enable Secure Network Communications (SNC)](#enable-secure-network-communications).

For SNC from SAP, you'll need to download the following files and have them ready to upload to your logic app resource. 

- **rscp4n.dll**
- **sapnco.dll**
- **sapnco_utils.dll**

You'll also need the following files from the **CommonCryptoLib.sar** package available from the [**SAP for Me, Software Download Center**](https://me.sap.com/softwarecenter)(SAP sign-in required). For more information, see [Download **CommonCryptoLib.sar**](#download-common-crypto).

- **sapcrypto.dll**
- **sapgenpse.exe**
- **slcryptokernal.dll**

> [!NOTE]
>
> If you use a different SNC implementation, these library files might have different names. 
> In any case, **sapgenpse.exe** is required to use SNC with the SAP built-in connector.

<a name="download-common-crypto"></a>

#### Download CommonCryptoLib.sar

To get the required assemblies and other files for SNC from SAP, you can find these files in the **CommonCryptoLib.sar** package available from the [**SAP for Me, Software Download Center**](https://me.sap.com/softwarecenter)(SAP sign-in required). You can use any currently supported **CommonCryptoLib** library implementation, based on compatible versions specific to your SAP environment. However, Microsoft recommends that you use the latest version for the **CommonCryptoLib** library available from SAP, assuming that version is compatible with your SAP environment.

To download the current **CommonCryptoLib** package, follow these steps:

1. Sign in to the [**SAP for Me, Software Download Center**](https://me.sap.com/softwarecenter).

1. On the **Download Software** page, select the **Installation & Upgrades** tab, expand **By Alphabetical Index (A-Z)**, and select **C** > **SAP Cryptographic Software** > **Downloads** tab > **SapCryptoLib** > **Downloads** tab > **CommonCryptoLib 8** > **Downloads** tab.

1. From the **Items Available to Download** list, select **Windows on x64 64Bit** or **Windows Server on IA32 x32 Bit**, whichever matches Standard logic app platform configuration.

   Microsoft recommends the 64-bit version.

1. From the list, select the highest level patch.

   The current patch number varies based on the selected Windows version.

1. If you don't have the [`SAPCAR` utility](https://help.sap.com/docs/Convergent_Charging/d1d04c0d65964a9b91589ae7afc1bd45/467291d0dc104d19bba073a0380dc6b4.html) to extract the .sar file, follow these steps:

   1. In the [**SAP for Me, Software Download Center**](https://me.sap.com/softwarecenter), on the **Download Software** page, select the **Support Packages & Patches** tab, expand **By Alphabetical Index (A-Z)**, and select **S** > **SAPCAR** > **Downloads** tab.

   1. From the **Items Available to Download** list, select your operating system, and the **sapcar.exe** file for the **SAPCAR** utility.

   > [!TIP]
   >
   > If you're unfamiliar with the **SAPCAR** utility, review the following SAP blog post, 
   > [Easily extract SAR files](https://blogs.sap.com/2004/11/18/easily-extract-sar-files/).

   The following batch file is an improved version that extracts archives to a subdirectory with the same name:

   ```text
   @echo off
   cd %~dp1
   mkdir %~n1
   sapcar.exe -xvf %~nx1 -R %~n1
   pause
   ```

1. Include all the extracted .dll and .exe files, which the following list shows for the current SAP **CommonCryptoLib** package:

   - **sapcrypto.dll**
   - **sapgenpse.exe**
   - **slcryptokernal.dll**

---

### Azure Logic Apps environment prerequisites

### [Consumption](#tab/consumption)

<a name="multitenant-prerequisites"></a>

For a Consumption workflow in multitenant Azure Logic Apps, the SAP managed connector integrates with SAP systems through an [on-premises data gateway](../connect-on-premises-data-sources.md). For example, in scenarios where your workflow sends a message to the SAP system, the data gateway acts as an RFC client and forwards the requests received from your workflow to SAP. Likewise, in scenarios where your workflow receives a message from SAP, the data gateway acts as an RFC server that receives requests from SAP and forwards them to your workflow.

1. On a host computer or virtual machine that exists in the same virtual network as the SAP system to which you're connecting, [download and install the on-premises data gateway](../install-on-premises-data-gateway-workflows.md).

   The data gateway helps you securely access on-premises data and resources. Make sure to use a supported version of the gateway. If you experience an issue with your gateway, try [upgrading to the latest version](https://aka.ms/on-premises-data-gateway-installer), which might include updates to resolve your problem.

1. In the Azure portal, [create an Azure gateway resource](../connect-on-premises-data-sources.md#create-azure-gateway-resource) for your on-premises data gateway installation.

1. On the same local computer as your on-premises data gateway installation, [download and install the latest SAP NCo client library](#sap-client-library-prerequisites).

1. For the host computer with your on-premises data gateway installation, configure the network host names and service names resolution.

   * To use the host names or service names for connections from Azure Logic Apps, you have to set up name resolution for each SAP Application, Message, and Gateway server along with their services:

     * In the **%windir%\System32\drivers\etc\hosts** file or in the DNS server that's available to the host computer for your on-premises data gateway installation, set up the network host name resolution.

     * In the **%windir%\System32\drivers\etc\services** file, set up the service name resolution.

   * If you don't intend to use network host names or service names for the connection, you can use host IP addresses and service port numbers instead.

   * If you don't have a DNS entry for your SAP system, the following example shows a sample entry for the hosts file:

     ```text
     10.0.1.9           sapserver                   # SAP single-instance system host IP by simple computer name
     10.0.1.9           sapserver.contoso.com       # SAP single-instance system host IP by fully qualified DNS name
     ```

     The following list shows a sample set of entries for the services files:

     ```text
     sapdp00            3200/tcp              # SAP system instance 00 dialog (application) service port
     sapgw00            3300/tcp              # SAP system instance 00 gateway service port
     sapmsDV6           3601/tcp              # SAP system ID DV6 message service port
     ```

### [Standard](#tab/standard)

<a name="single-tenant-prerequisites"></a>

For a Standard workflow in single-tenant Azure Logic Apps, use the SAP *built-in* connector to directly access resources that are protected by an Azure virtual network. You can also use other built-in connectors that let workflows directly access on-premises resources without having to use the on-premises data gateway.

1. To use the SAP connector, you need to download the following files and have them read to upload to your Standard logic app resource. For more information, see [SAP NCo client library prerequisites](#sap-client-library-prerequisites):

   - **rscp4n.dll**
   - **sapnco.dll**
   - **sapnco_utils.dll**

1. For SNC from SAP, you need to download the following files and have them ready to upload to your logic app resource. For more information, see [SNC prerequisites](#snc-prerequisites-standard):

   - **sapcrypto.dll**
   - **sapgenpse.exe**
   - **slcryptokernal.dll**

#### Upload assemblies to Azure portal

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Assemblies**.

1. On the **Assemblies** page toolbar, select **Add**.

1. After the **Add Assembly** pane opens, for **Assembly Type**, select **Client/SDK Assembly (.NET Framework)**.

1. Under **Upload Files**, add the previously described required files that you downloaded:

   **SAP NCo**
   - **rscp4n.dll**
   - **sapnco.dll**
   - **sapnco_utils.dll**

   **CommonCryptoLib**
   - **sapcrypto.dll**
   - **sapgenpse.exe**
   - **slcryptokernal.dll**

1. When you're ready, select **Upload Files**.

   If the assembly file is 4 MB or smaller, you can either browse and select or drag and drop the file. For files larger than 4 MB, follow these steps instead:

   1. On the logic app menu, under **Development Tools**, select **Advanced Tools**.

   1. On the **Advanced Tools** page, select **Go**.

   1. On the **Kudu** toolbar, from the **Debug console** menu, select **CMD**.

   1. Open the following folders: **site** > **wwwroot**

   1. On the folder structure toolbar, select the plus (**+**) sign, and then select **New folder**.

   1. Create the following folder and subfolders: **lib** > **builtinOperationSdks** > **net472**

   1. In the **net472** folder, upload the assembly files larger than 4 MB.

---

<a name="enable-secure-network-communications"></a>

### Enable Secure Network Communications (SNC)

### [Consumption](#tab/consumption)

For a Consumption workflow that runs in multitenant Azure Logic Apps, you can enable SNC for authentication, which applies only when you use the data gateway. Before you start, make sure that you met all the necessary [prerequisites](sap.md?tabs=consumption#prerequisites) and [SNC prerequisites](sap.md?tabs=consumption#snc-prerequisites).

For more information about SNC, see [Getting started with SAP SNC for RFC integrations - SAP blog](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/getting-started-with-sap-snc-for-rfc-integrations/ba-p/13983462).

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. Add an SAP managed connector operation or edit the connection for an existing operation.

1. In the SAP connection information box, provide the [required information](/connectors/sap/#creating-a-connection).

   > [!NOTE]
   >
   > For **Authentication Type**, **Basic** is currently the only available option. 
   > The **SAP Username** and **SAP Password** fields are optional. If you don't provide a username 
   > and password, the connector uses the client certificate provided in a later step for authentication.

   :::image type="content" source="media/sap/sap-connection.png" alt-text="Screenshot shows SAP connection parameters in Consumption workflows.":::

1. To enable SNC, in the SAP connection information box, select **Use SNC**, and provide the corresponding [required information](/connectors/sap/#creating-a-connection):

   | Parameter | Description |
   |-----------|-------------|
   | **SNC Library** | Enter one of the following values: <br><br>- The name for your SNC library, for example, **sapsnc.dll** <br>- The relative path to the NCo installation location, for example, **.\security\sapsnc.dll** <br>- The absolute path to the NCo installation location, for example, **c:\security\sapsnc.dll** |
   | **SNC SSO** | Select either **Logon using the SNC identity** or **Logon with the username/password provided on RFC level**. <br><br>Typically, the SNC identity is used to authenticate the caller. You can choose to authenticate with a username and password instead, but this parameter value is still encrypted. |
   | **SNC My Name** | In most cases, you can omit this value. The installed SNC solution usually knows its own SNC name. In the case where your solution supports multiple identities, you might have to specify the identity to use for this particular destination or server. |
   | **SNC Partner Name** | Enter the name for the backend SNC, for example, **p:CN=DV3, OU=LA, O=MS, C=US**. |
   | **SNC Quality of Protection** | Select the quality of service to use for SNC communication with this particular destination or server. The default value is defined by the backend system. The maximum value is defined by the security product used for SNC. |
   | **SNC Certificate** | Enter the base64-encoded *public* key for the certificate to use for identifying your client to SAP. <br><br>**Note**: - Don't include the PEM header or footer. <br><br>- Don't enter the private key for the client certificate here. Your Personal Security Environment (PSE) must contain the matching private key for this certificate and might contain other private certificates. For more information, review the next parameter. |
   | **PSE** | Enter your SNC Personal Security Environment (PSE) as a base64-encoded binary. <br><br>- Your PSE must contain the private key for the client certificate where the thumbprint matches the public key for the client certificate in the **SNC Certificate** parameter. <br><br>- Although your PSE might contain multiple client certificates, to use different client certificates, create separate workflows instead. |

   ![Screenshot shows SAP connection parameters with SNC enabled for Consumption workflow.](./media/sap/sap-connection-snc-consumption.png)

1. To finish creating your connection, select **Create new**.

   If the parameters are correct, the connection is created. If there's a problem with the parameters, the connection creation dialog displays an error message. To troubleshoot connection parameter issues, you can use the on-premises data gateway installation and the gateway's local logs.

### [Standard](#tab/standard)

For a Standard workflow that runs in single-tenant Azure Logic Apps, you can enable SNC for authentication. Before you start, make sure that you met all the necessary [prerequisites](sap.md?tabs=single-tenant#prerequisites) and [SNC prerequisites for single-tenant](sap.md?tabs=single-tenant#snc-prerequisites). For more information about SNC, see [Getting started with SAP SNC for RFC integrations - SAP blog](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/getting-started-with-sap-snc-for-rfc-integrations/ba-p/13983462).

#### Set up your SNC personal security environment and password

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. To specify your SNC Personal Security Environment (PSE) and PSE password, follow these steps:

   1. On your logic app resource menu, under **Settings**, select **Environment variables**.

   1. On the **App settings** tab, check whether the settings named **SAP_PSE** and **SAP_PSE_PASSWORD** already exist. If they don't exist, you have to add each setting at the end of the settings list, provide the following required information, and select **Apply** for each setting:

      | Name | Value | Description |
      |------|-------|-------------|
      | **SAP_PSE** | <*PSE-value*> | Enter your SNC Personal Security Environment (PSE) as a base64-encoded binary. <br><br>- Your PSE must contain the private key for the client certificate where the thumbprint matches the public key for the client certificate in the SAP connection's **SNC Certificate** parameter that is available when you create the connection. <br><br>- Although your PSE might contain multiple client certificates, to use different client certificates, create separate workflows instead. <br><br>- The PSE must have no PIN. If necessary, set the PIN to empty using the SAPGENPSE utility. |
      | **SAP_PSE_PASSWORD** | <*PSE-password*> | The password, also known as PIN, for your PSE |

#### Create a connection with the SAP built-in connector

Follow these steps for the SAP *built-in* connector. To create a connection with the SAP managed connector, see the [steps to enable SNC for an SAP connection in a Consumption workflow](sap.md?tabs=consumption#enable-secure-network-communications).

1. On your logic app resource menu, under **Workflows**, select **Workflows**.

1. Add a new empty Standard workflow or open an existing workflow.

1. In the workflow designer, add an SAP built-in connector operation or edit the connection for an existing operation.

1. In the SAP connection information box, provide the [required information](/azure/logic-apps/connectors/built-in/reference/sap/#authentication), based on the **Authentication Type** that you select.

   > [!NOTE]
   >
   > If you plan to enable SNC, continue to the next step 
   > after you provide the connection name and SAP client ID.

   :::image type="content" source="media/sap/sap-connection.png" alt-text="Screenshot shows SAP built-in connection parameters in Standard workflows.":::

1. To enable SNC, in the SAP connection information box, open the **Authentication Type** list, and select **Logon Using SNC**. Provide the [required information](/azure/logic-apps/connectors/built-in/reference/sap/#authentication):

   | Parameter | Description |
   |-----------| ------------|
   | **SNC My Name** | In most cases, you can omit this value. The installed SNC solution usually knows its own SNC name. In the case where your solution supports multiple identities, you might have to specify the identity to use for this particular destination or server. |
   | **SNC Partner Name** | Enter the name for the backend SNC, for example, **p:CN=DV3, OU=LA, O=MS, C=US**. |
   | **SNC Quality of Protection** | Select the quality of service to use for SNC communication with this particular destination or server. The default value is defined by the backend system. The maximum value is defined by the security product used for SNC. |
   | **SNC Type** | Select the SNC authentication to use. |
   | **Certificate User** | Enter the user to connect when you have a certificate that's assigned to multiple users. |
   | **SNC Certificate** | Enter your SNC client's public certificate in base64-encoded format. This parameter specifies the certificates that this connection must use. <br><br>**Note**: - Don't include the PEM header or footer. <br><br>- Don't enter the private certificate here because the Personal Security Environment (PSE) might contain multiple private certificates. You specify this PSE using the **SAP_PSE** app setting for your Standard logic app resource. <br><br>- If you're using more than one SNC client certificate for your logic app resource, you must provide the same PSE for all connections. |

   :::image type="content" source="media/sap/sap-connection-snc-standard.png" alt-text="Screenshot shows SAP built-in connection parameters with SNC enabled for Standard workflows.":::

1. To finish creating your connection, select **Create new**.

   If the parameters are correct, the connection is created. If there's a problem with the parameters, the connection creation dialog displays an error message.

---

### Convert a binary PSE file into base64-encoded format

1. Use a PowerShell script, for example:

   ```powershell
   Param ([Parameter(Mandatory=$true)][string]$psePath, [string]$base64OutputPath)
   $base64String = [convert]::ToBase64String((Get-Content -path $psePath -Encoding byte))
   if ($base64OutputPath -eq $null)
   {
       Write-Output $base64String
   }
   else
   {
       Set-Content -Path $base64OutputPath -Value $base64String
       Write-Output "Output written to $base64OutputPath"
   } 
   ```

1. Save the script as a **pseConvert.ps1** file, and then invoke the script, for example:

   ```output
   .\pseConvert.ps1 -psePath "C:\Temp\SECUDIR\request.pse" -base64OutputPath "connectionInput.txt"
   Output written to connectionInput.txt 
   ```

   If you don't provide the output path parameter, the script's output to the console contains line breaks. Remove the line breaks in the base 64-encoded string for the connection input parameter.

<a name="test-sending-idocs-from-sap"></a>

### Set up and test sending IDocs from SAP to your workflow

To send IDocs from SAP to your logic app workflow, follow these steps to set up and test your SAP configuration with your logic app workflow. These steps apply only to testing as production environments require additional configuration.

To send IDocs from SAP to your workflow, you need the following minimum configuration:

1. [Create an RFC destination.](#create-rfc-destination)
1. [Create an ABAP connection.](#create-abap-connection)
1. [Create a receiver port.](#create-receiver-port)
1. [Create a sender port.](#create-sender-port)
1. [Create a logical system partner.](#create-logical-system-partner)
1. [Create a partner profile.](#create-partner-profiles)
1. [Test sending messages.](#test-sending-messages)

#### Create RFC destination

This destination identifies your logic app workflow as the receiver port.

1. In SAP, open the **Configuration of RFC Connections** settings. You can use the **sm59** transaction code (T-Code) with the **/n** prefix.

1. Select **TCP/IP Connections** > **Create**.

1. Create a new RFC destination with the following settings:

   1. For **RFC Destination**, enter a name.

   1. On the **Technical Settings** tab, for **Activation Type**, select **Registered Server Program**.

   1. For **Program ID**, enter a value. In your SAP server, your workflow's trigger is registered using this identifier.

      > [!IMPORTANT]
      >
      > The SAP **Program ID** is case-sensitive. Make sure that you consistently use the same case format 
      > for your **Program ID** when you configure your workflow and SAP server. Otherwise, you might 
      > receive the following errors in the tRFC Monitor (T-Code SM58) when you attempt to send an IDoc to SAP:
      >
      > * **Function IDOC_INBOUND_ASYNCHRONOUS not found**
      > * **Non-ABAP RFC client (partner type) not supported**
      >
      > For more information from SAP, review the following notes (login required):
      >
      > * [https://launchpad.support.sap.com/#/notes/2399329](https://launchpad.support.sap.com/#/notes/2399329)
      > * [https://launchpad.support.sap.com/#/notes/353597](https://launchpad.support.sap.com/#/notes/353597)

   1. On the **Unicode** tab, for **Communication Type with Target System**, select **Unicode**.

      > [!NOTE]
      >
      > SAP .NET Client libraries support only Unicode character encoding. If you get the error 
      > **Non-ABAP RFC client (partner type) not supported** when you send an IDoc from SAP to 
      > Azure Logic Apps, check that the **Communication Type with Target System** value is set to **Unicode**.

1. Save your changes.

1. Register your new **Program ID** with Azure Logic Apps by creating a logic app workflow that starts with the SAP managed trigger named **When a message is received**.

   That way, when you save your workflow, Azure Logic Apps registers the **Program ID** on the SAP Gateway.

1. In your workflow's trigger history, the on-premises data gateway SAP Adapter logs, if applicable, and the SAP Gateway trace logs, check the registration status.

   In the SAP Gateway monitor box (T-Code SMGW), under **Logged-On Clients**, the new registration appears as **Registered Server**.

1. To test your connection, under your new **RFC Destination**, select **Connection Test**.

#### Create ABAP connection

This destination identifies your SAP system as the sender port.

1. In SAP, open the **Configuration of RFC Connections** settings. You can use the **sm59** transaction code (T-Code) with the **/n** prefix.

1. Select **ABAP Connections** > **Create**.

1. For **RFC Destination**, enter the identifier for your test SAP system.

1. In **Technical Settings**, leave the target host empty to create a local connection to the SAP system.

1. Save your changes.

1. To test your connection, select **Connection Test**.

#### Create sender port

1. In SAP, open the **Ports In IDOC processing** settings. You can use the **we21** transaction code (T-Code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**.

1. For your test port, enter a **Name** that starts with **SAP**. Save your changes.

   All sender port names must start with the letters **SAP**, for example, **SAPTEST**.

1. In the settings for your new sender port, for **RFC destination**, enter the identifier for [your ABAP connection](#create-abap-connection).

1. Save your changes.

#### Create receiver port

1. In SAP, open the **Ports In IDOC processing** settings. You can use the **we21** transaction code (T-Code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**. For your test port, enter a **Name**. Save your changes.

1. In the settings for your new receiver port, for **RFC destination**, enter the identifier for [your test RFC destination](#create-rfc-destination).

1. Save your changes.

#### Create logical system partner

1. In SAP, open the **Change View "Logical Systems": Overview** settings. You can use the **bd54** transaction code (T-Code).

1. Accept the following warning message that appears: **Caution: The table is cross-client**

1. Above the list that shows your existing logical systems, select **New Entries**.

1. For your new logical system, enter a **Log.System** identifier and a short **Name** description. Save your changes.

1. When the **Prompt for Workbench** appears, create a new request by providing a description, or if you already created a request, skip this step.

1. After you create the workbench request, link that request to the table update request. To confirm that your table was updated, save your changes.

#### Create partner profiles

For production environments, you must create the following two partner profiles:

- One profile for the sender, which is your organization and SAP system.
- One profile for the receiver, which is your logic app resource and workflow.

1. In SAP, open the **Partner profiles** settings. You can use the **we20** transaction code (T-Code) with the **/n** prefix.

1. Under **Partner Profiles**, select **Partner Type LS** > **Create**.

1. Create a new partner profile with the following settings:

   | Setting | Description |
   |---------|-------------|
   | **Partner No.** | Enter [your logical system partner's identifier](#create-logical-system-partner). |
   | **Partn. Type** | Enter **LS**. |
   | **Agent** | Enter the identifier for the SAP user account to use when you register program identifiers for Azure Logic Apps or other non-SAP systems. |

1. Save your changes.

   If you didn't [create the logical system partner](#create-logical-system-partner), you get the error, **Enter a valid partner number**.

1. In your partner profile's settings, under **Outbound parmtrs.**, select **Create outbound parameter**.

1. Create a new outbound parameter with the following settings:

    * Enter your **Message Type**, for example, **CREMAS**.

    * Enter your [receiver port's identifier](#create-receiver-port).

    * Enter an IDoc size for **Pack. Size**. Or, to [send IDocs one at a time from SAP](sap-create-example-scenario-workflows.md#receive-idoc-packets-sap), select **Pass IDoc Immediately**.

1. Save your changes.

#### Test sending messages

1. In SAP, open the **Test Tool for IDoc Processing** settings. You can use the **we19** transaction code (T-Code) with the **/n** prefix.

1. Under **Template for test**, select **Via message type**. Enter your message type, for example, **CREMAS**. Select **Create**.

1. Confirm the **Which IDoc type?** message by selecting **Continue**.

1. Select the **EDIDC** node. Enter the appropriate values for your receiver and sender ports. Select **Continue**.

1. Select **Standard Outbound Processing**.

1. To start outbound IDoc processing, select **Continue**.

   When the tool finishes processing, the **IDoc sent to SAP system or external program** message appears.

1. To check for processing errors, use the **sm58** transaction code (T-Code) with the **/n** prefix.

## Create workflows for common SAP scenarios

For the how-to guide to creating workflows for common SAP integration workloads, see the following steps:

* [Receive message from SAP](sap-create-example-scenario-workflows.md#receive-messages-sap)
* [Receive IDoc packets from SAP](sap-create-example-scenario-workflows.md#receive-idoc-packets-sap)
* [Send IDocs to SAP](sap-create-example-scenario-workflows.md#send-idocs-sap)
* [Generate schemas for artifacts in SAP](sap-generate-schemas-for-artifacts.md)

## Create workflows for advanced SAP scenarios

* [Change language headers for sending data to SAP](sap-create-example-scenario-workflows.md#change-language-headers)
* [Confirm transaction separately and avoid duplicate IDocs](sap-create-example-scenario-workflows.md#confirm-transaction-explicitly)

## Find extended error logs (Managed connector only)

If you're using the SAP managed connector, you can find full error messages by checking your SAP Adapter's extended logs. You can also [enable an extended log file for the SAP connector](#set-up-extended-sap-logging).

* For on-premises data gateway releases from April 2020 and earlier, logs are disabled by default.

* For on-premises data gateway releases from June 2020 and later, you can [enable gateway logs in the app settings](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app).

  * The default logging level is **Warning**.

  * If you enable  **Additional logging** in the **Diagnostics** settings of the on-premises data gateway app, the logging level is increased to **Informational**.

  * To increase the logging level to **Verbose**, update the following setting in your configuration file. Typically, the configuration file is located at `C:\Program Files\On-premises data gateway\Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config`.

    ```xml
    <setting name="SapTraceLevel" serializeAs="String">
       <value>Verbose</value>
    </setting>
    ```

<a name="set-up-extended-sap-logging"></a>

## Set up extended SAP logging in on-premises data gateway (Managed connector only)

If you use an [on-premises data gateway for Azure Logic Apps](../install-on-premises-data-gateway-workflows.md), you can configure an extended log file for the SAP connector. You can use your on-premises data gateway to redirect Event Tracing for Windows (ETW) events into rotating log files that are included in your gateway's logging .zip files.

You can [export all of your gateway's configuration and service logs](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app) to a .zip file in from the gateway app's settings.

> [!NOTE]
>
> Extended logging might affect your workflow's performance when always enabled. As a best practice, 
> turn off extended log files after you're finished with analyzing and troubleshooting an issue.

### Capture ETW events

As an optional advanced logging task, you can directly capture ETW events, and then [consume the data in Azure Diagnostics in Event Hubs](/azure/azure-monitor/agents/diagnostics-extension-stream-event-hubs) or [collect your data to Azure Monitor Logs](/azure/azure-monitor/agents/diagnostics-extension-logs). For more information, review the [best practices for collecting and storing data](/azure/architecture/best-practices/monitoring#collecting-and-storing-data).

To work with the resulting ETL files, you can use [PerfView](https://github.com/Microsoft/perfview/blob/main/README.md), or you can write your own program. The following walkthrough uses PerfView:

1. In the PerfView menu, select **Collect** &gt; **Collect** to capture the events.

1. In the **Additional Provider** parameter, enter `*Microsoft-LobAdapter` to specify the SAP provider to capture SAP Adapter events. If you don't specify this information, your trace only includes general ETW events.

1. Keep the other default settings. If you want, you can change the file name or location in the **Data File** parameter.

1. Select **Start Collection** to begin your trace.

1. After you've reproduced your issue or collected enough analysis data, select **Stop Collection**.

1. To share your data with another party, such as Azure support engineers, compress the ETL file.

1. To view the content of your trace:

   1. In PerfView, select **File** &gt; **Open** and select the ETL file you just generated.

   1. In the PerfView sidebar, the **Events** section under your ETL file.

   1. Under **Filter**, filter by `Microsoft-LobAdapter` to only view relevant events and gateway processes.

<a name="test-workflow-logging"></a>

### Test your workflow

Based on whether you have a Consumption workflow in multitenant Azure Logic Apps or a Standard workflow in single-tenant Azure Logic Apps, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. If your Consumption logic app resource isn't already enabled, on your logic app menu, select **Overview**. On the toolbar, select **Enable**.

1. On the designer toolbar, select **Run Trigger** > **Run** to manually start your workflow.

1. To trigger your workflow, send a message from your SAP system.

1. Return to your logic app's **Overview** pane. Under **Runs history**, find any new runs for your workflow.

1. Open the most recent run, which shows a manual run. Find and review the trigger outputs section.

### [Standard](#tab/standard)

1. If your Standard logic app resource is stopped or disabled, from your workflow, go to the logic app resource level, and select **Overview**. On the toolbar, select **Start**.

1. Return to the workflow level. On the workflow menu, select **Overview**. On the toolbar, select **Run** > **Run** to manually start your workflow.

1. To trigger your workflow, send a message from your SAP system.

1. Return to your workflow's **Overview** pane. Under **Run History**, find any new runs for your workflow.

1. Open the most recent run, which shows a manual run. Find and review the trigger outputs section.

---

## Enable SAP client library (NCo) logging and tracing (built-in connector only)

When you have to investigate any problems with this component, you can set up custom text file-based NCo tracing, which SAP or Microsoft support might request from you. By default, this capability is disabled because enabling this trace might negatively affect performance and quickly consume the application host's storage space. 

You can control this tracing capability at the application level by adding the following settings:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Settings**, select **Environment variables** to review the application settings.

1. On the **Environment variables** page, on the **App settings** tab, add the following application settings:

   * **SAP_RFC_TRACE_DIRECTORY**: The directory where to store the NCo trace files, for example, **C:\home\LogFiles\NCo**.

   * **SAP_RFC_TRACE_LEVEL**: The NCo trace level with **Level4** as the suggested value for typical verbose logging. SAP or Microsoft support might request that you set a [different trace level](#trace-levels).
   
     > [!NOTE]
     >
     > For Standard logic app workflows that use runtime version 1.69.0 or later, you can enable
     > logging for multiple trace levels by separating each trace level with a comma (**,**).
     >
     > To find your workflow's runtime version, follow these steps:
     >
     > 1. In the Azure portal, on your workflow menu, select **Overview**.
     > 2. In the **Essentials** section, find the **Runtime Version** property.

   * **SAP_CPIC_TRACE_LEVEL**: The Common Programming Interface for Communication (CPI-C) trace level with **Verbose** as the suggested value for typical verbose logging. SAP or Microsoft support might request that you set a [different trace level](#trace-levels).

   For more information about adding application settings, see [Edit host and app settings for Standard logic app workflows](../edit-app-settings-host-settings.md#manage-app-settings).

1. Save your changes. This step restarts the application.

<a name="trace-levels"></a>

### Trace levels available

#### NCo Trace Levels

| Value | Description |
|-------|-------------|
| Level1 | The level for tracing remote function calls. |
| Level2 | The level for tracing remote function calls and public API method calls. |
| Level3 | The level for tracing remote function calls, public API method calls, and internal API method calls. |
| Level4 | The level for tracing remote function calls, public API method calls, internal API method calls, hex dumps for the RFC protocol, and network-related information. |
| Locking | Writes data to the trace files that shows when threads request, acquire, and release locks on objects. |
| Metadata | Traces the metadata involved in a remote function call for each call. |
| None | The level for suppressing all trace output. |
| ParameterData | Traces the container data sent and received during each remote function call. |
| Performance | Writes data to the trace files that can help with analyzing performance issues. |
| PublicAPI | Traces most methods of the public API, except for getters, setters, or related methods. |
| InternalAPI | Traces most methods of the internal API, except for getters, setters, or related methods. |
| RemoteFunctionCall | Traces remote function calls. |
| RfcData | Traces the bytes sent and received during each remote function call. |
| SessionProvider | Traces all methods of the currently used implementation of **ISessionProvider**. |
| SetValue | Writes information to the trace files regarding values set for parameters of functions, or fields of structures or tables. |

#### CPIC Trace Levels

| Value | Description |
|-------|-------------|
| Off | No logging |
| Basic | Basic logging |
| Verbose | Verbose logging |
| VerboseWithData | Verbose logging with all server response dump |

### View the trace

1. On Standard logic app resource menu, under **Development Tools**, select **Advanced Tools** > **Go**.

1. On the **Kudu** toolbar, select **Debug Console** > **CMD**.

1. Browse to the folder for the application setting named **$SAP_RFC_TRACE_DIRECTORY**.

   A new folder named **NCo**, or whatever folder name that you used, appears for the application setting value, **C:\home\LogFiles\NCo**, that you set earlier.

1. Open the **$SAP_RFC_TRACE_DIRECTORY** folder, which contains the following files:

   * NCo trace logs: A file named **dev_nco_rfc.log**, one or multiple files named **nco_rfc_NNNN.log**, and one or multiple files named **nco_rfc_NNNN.trc** files where **NNNN** is a thread identifier.
   
   * CPIC trace logs: One or multiple files named **nco_cpic_NNNN.trc** files where **NNNN** is thread identifier.

1. To view the content in a log or trace file, select the **Edit** button next to a file.

   > [!NOTE]
   >
   > If you download a log or trace file that your logic app workflow opened 
   > and is currently in use, your download might result in an empty file.

## Enable SAP Common Crypto Library (CCL) tracing (built-in connector only)

If you have to investigate any problems with the crypto library while using SNC authentication, you can set up custom text file-based CCL tracing. You can use these CCL logs to troubleshoot SNC authentication issues, or share them with Microsoft or SAP support, if requested. By default, this capability is disabled because enabling this trace might negatively affect performance and quickly consume the application host's storage space.

You can control this tracing capability at the application level by adding the following settings:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On Standard logic app resource menu, under **Development Tools**, select **Advanced Tools** > **Go**.

1. On the **Kudu** toolbar, select **Debug Console** > **CMD**.

1. Browse to a location under **C:\home\site\wwwroot**, and create a text file, for example: **CCLPROFILE.txt**.

   For more information about logging parameters, see [**Tracing** > SAP NOTE 2338952](https://me.sap.com/notes/2338952/E). The following sample provides an example tracing configuration:
   
   ```
   ccl/trace/directory=C:\home\LogFiles\CCLLOGS
   ccl/trace/level=4
   ccl/trace/rotatefilesize=10000000
   ccl/trace/rotatefilenumber=10
   ```
   
1. On the logic app menu, under **Settings**, select **Environment variables** to review the application settings.

1. On the **Environment variables** page, on the **App settings** tab, add the following application setting:

   **CCL_PROFILE**: The directory where **CCLPROFILE.txt** was created, for example, **C:\home\site\wwwroot\CCLPROFILE.txt**.

1. Save your changes. This step restarts the application.

### View the trace

1. On Standard logic app resource menu, under **Development Tools**, select **Advanced Tools** > **Go**.

1. On the **Kudu** toolbar, select **Debug Console** > **CMD**.

1. Browse to the folder for the **$ccl/trace/directory** parameter, which is from the **CCLPROFILE.txt** file.

    Usually, the trace files are named **sec-Microsoft.Azure.Work-$processId.trc** and **sec-sapgenpse.exe-$processId.trc**.

   Your logic app workflow performs SNC authentication as a two-step process:

   1. Your logic app workflow invokes **sapgenpse.exe** to generate a **cred_v2** file from the PSE file.
   
      You can find the traces related to this step in a file named **sec-sapgenpse.exe-$processId.trc**.

   1. Your logic app workflow authenticates access to your SAP server by consuming the generated **cred_v2** file, with the SAP client library invoking the common crypto library.

       You can find the traces related to this step in a file named **sec-Microsoft.Azure.Work-$processId.trc**.

## Send SAP telemetry for on-premises data gateway to Azure Application Insights

With the August 2021 update for the on-premises data gateway, SAP connector operations can send telemetry data from the SAP NCo client library and traces from the Microsoft SAP Adapter to [Application Insights](/azure/azure-monitor/app/app-insights-overview), which is a capability in Azure Monitor. This telemetry primarily includes the following data:

* Metrics and traces based on SAP NCo metrics and monitors.

* Traces from Microsoft SAP Adapter.

### Metrics and traces from SAP NCo client library

SAP NCo-based metrics are numeric values that might or might not vary over a time period, based on the usage and availability of resources on the on-premises data gateway. You can use these metrics to better understand system health and to create alerts about the following activities:

* System health decline.
* Unusual events.
* Heavy system load.

This information is sent to the Application Insights table named **customMetrics**. By default, metrics are sent at 30-second intervals.

SAP NCo-based traces include text information that's used with metrics. This information is sent to the Application Insights table named **traces**. By default, traces are sent at 10-minute intervals.

SAP NCo metrics and traces are based on SAP NCo metrics, specifically the following NCo classes:

* RfcDestinationMonitor.
* RfcConnectionMonitor.
* RfcServerMonitor.
* RfcRepositoryMonitor.

For more information about the metrics that each class provides, see the [SAP NCo documentation (sign-in required)](https://support.sap.com/en/product/connectors/msnet.html#section_512604546).

### Set up SAP telemetry for Application Insights

Before you can send SAP telemetry for your gateway installation to Application Insights, you need to have created and set up your Application Insights resource. For more information, review the following documentation:

* [Create an Application Insights resource (classic)](/previous-versions/azure/azure-monitor/app/create-new-resource)

* [Workspace-based Application Insights resources](/azure/azure-monitor/app/create-workspace-resource)

To enable sending SAP telemetry to Application insights, follow these steps:

1. Download the NuGet package for **Microsoft.ApplicationInsights.EventSourceListener.dll** from this location: [https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventSourceListener/2.14.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventSourceListener/2.14.0).

1. Add the downloaded file to your on-premises data gateway installation directory, for example, **C:\Program Files\On-Premises Data Gateway**.

1. In your on-premises data gateway installation directory, check that the **Microsoft.ApplicationInsights.dll** file has the same version number as the **Microsoft.ApplicationInsights.EventSourceListener.dll** file that you added. The gateway currently uses version 2.14.0.

1. In the **ApplicationInsights.config** file, add your [Application Insights instrumentation key](/azure/azure-monitor/app/sdk-connection-string) by uncommenting the line with the `<InstrumentationKey></InstrumentationKey>` element. Replace the placeholder, *your-Application-Insights-instrumentation-key*, with your key, for example:

      ```xml
      <?xml version="1.0" encoding="utf-8"?>
      <ApplicationInsights schemaVersion="2014-05-30" xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
         <!-- Uncomment this element and insert your Application Insights key to receive ETW telemetry about your gateway <InstrumentationKey>*your-instrumentation-key-placeholder*</InstrumentationKey> -->
         <TelemetryModules>
            <Add Type="Microsoft.ApplicationInsights.Extensibility.Implementation.Tracing.DiagnosticsTelemetryModule, Microsoft.ApplicationInsights">
               <IsHeartbeatEnabled>false</IsHeartbeatEnabled>
            </Add>
            <Add Type="Microsoft.ApplicationInsights.EventSourceListener.EventSourceTelemetryModule, Microsoft.ApplicationInsights.EventSourceListener">
               <Sources>
                  <Add Name="Microsoft-LobAdapter" Level="Verbose" />
               </Sources>
            </Add>
         </TelemetryModules>
      </ApplicationInsights>
      ```

1. In the **ApplicationInsights.config** file, you can change the required traces `Level` value for your SAP connector operations, per your requirements, for example:

   ```xml
   <Add Type="Microsoft.ApplicationInsights.EventSourceListener.EventSourceTelemetryModule, Microsoft.ApplicationInsights.EventSourceListener">
      <Sources>
         <Add Name="Microsoft-LobAdapter" Level="Verbose" />
      </Sources>
   </Add>
   ```

   For more information, review the following documentation:

   * `Level` values: [EventLevel Enum](/dotnet/api/system.diagnostics.tracing.eventlevel)

   * [EventSource tracking](/azure/azure-monitor/app/configuration-with-applicationinsights-config#eventsource-tracking)

   * [EventSource events](/azure/azure-monitor/app/asp-net-trace-logs#use-eventsource-events)

1. After you apply your changes, restart the on-premises data gateway service.

### Review metrics in Application Insights

After your SAP operations run in your logic app workflow, you can review the telemetry that was sent to Application Insights.

1. In the Azure portal, open your Application Insights resource.

1. On the resource menu, under **Monitoring**, select **Logs**.

   The following screenshot shows the Azure portal with Application Insights, which is open to the **Logs** pane:

   [![Screenshot shows Azure portal with Application Insights open to the "Logs" pane for creating queries.](./media/sap/application-insights-query-panel.png)](./media/sap/application-insights-query-panel.png#lightbox)

1. On the **Logs** pane, you can create a [query](/azure/data-explorer/kusto/query/) using the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/concepts/) that's based on your specific requirements.

   You can use a query pattern similar to the following example query:

   ```Kusto
   customMetrics
   | extend DestinationName = tostring(customDimensions["DestinationName"])
   | extend MetricType = tostring(customDimensions["MetricType"])
   | where customDimensions contains "RfcDestinationMonitor"
   | where name contains "MaxUsedCount"
   ```

1. After you run your query, review the results.

   The following screenshot shows the example query's metrics results table:

   [![Screenshot shows Application Insights with the metrics results table.](./media/sap/application-insights-metrics.png)](./media/sap/application-insights-metrics.png#lightbox)

   * **MaxUsedCount** is "The maximal number of client connections that were simultaneously used by the monitored destination." as described in the [SAP NCo documentation (sign-in required)](https://support.sap.com/en/product/connectors/msnet.html#section_512604546). You can use this value to understand the number of simultaneously open connections.

   * The **valueCount** column shows **2** for each reading because metrics are generated at 30-second intervals. Application Insights aggregates these metrics by the minute.

   * The **DestinationName** column contains a character string that is a Microsoft SAP Adapter internal name.

     To better understand this Remote Function Call (RFC) destination, use this value with `traces`, for example:

     ```Kusto
     customMetrics
     | extend DestinationName = tostring(customDimensions["DestinationName"])
     | join kind=inner (traces
        | extend DestinationName = tostring(customDimensions["DestinationName"]),
        AppServerHost = tostring(customDimensions["AppServerHost"]),
        SncMode = tostring(customDimensions["SncMode"]),
        SapClient = tostring(customDimensions["Client"])
        | where customDimensions contains "RfcDestinationMonitor"
        )
        on DestinationName , $left.DestinationName == $right.DestinationName
     | where customDimensions contains "RfcDestinationMonitor"
     | where name contains "MaxUsedCount"
     | project AppServerHost, SncMode, SapClient, name, valueCount, valueSum, valueMin, valueMax
     ```

You can also create metric charts or alerts using those capabilities in Application Insights, for example:

[![Screenshot shows Application Insights with the results in chart format.](./media/sap/application-insights-metrics-chart.png)](./media/sap/application-insights-metrics-chart.png#lightbox)

### Traces from Microsoft SAP Adapter

You can use traces sent from Microsoft SAP Adapter for issue post-analysis and to find any existing internal system errors that might or might not surface from SAP connector operations. These traces have `message` set to `"n\a"` because they come from an earlier event source framework that predates Application Insights, for example:

```Kusto
traces
| where message == "n/a"
| where severityLevel > 0
| extend ActivityId = tostring(customDimensions["ActivityId"])
| extend fullMessage = tostring(customDimensions["fullMessage"])
| extend shortMessage = tostring(customDimensions["shortMessage"])
| where ActivityId contains "8ad5952b-371e-4d80-b355-34e28df9b5d1"
```

The following screenshot shows the example query's traces results table:

[![Screenshot shows Application Insights with the traces results table.](./media/sap/application-insights-traces.png)](./media/sap/application-insights-traces.png#lightbox)

## Next steps

* [Create example workflows for common SAP scenarios](sap-create-example-scenario-workflows.md)
