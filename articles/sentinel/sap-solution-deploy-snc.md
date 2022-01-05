---
title: Deploy the Azure Sentinel SAP data connector with Secure Network Communications (SNC)  | Microsoft Docs
description: Learn how to deploy the Azure Sentinel data connector for SAP environments with a secure connection via SNC, for the NetWeaver/ABAP interface based logs.
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.custom: mvc
ms.date: 08/01/2021
ms.subservice: azure-sentinel

---

# Deploy the Azure Sentinel SAP data connector with SNC

This article describes how to deploy the Azure Sentinel SAP data connector when you have a secure connection to SAP via Secure Network Communications (SNC) for the NetWeaver/ABAP interface based logs.

> [!NOTE]
> The default, and most recommended process for deploying the Azure Sentinel SAP data connector is by [using an Azure VM](sap-deploy-solution.md). This article is intended for advanced users.

> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

The basic prerequisites for deploying your Azure Sentinel SAP data connector are the same regardless of your deployment method.

Make sure that your system complies with the prerequisites documented in the main [SAP data connector deployment procedure](sap-deploy-solution.md#prerequisites) before you start.

Other prerequisites for working with SNC include:

- **A secure connection to SAP with SNC**. Define the connection-specific SNC parameters in the repository constants for the AS ABAP system you're connecting to. For more information, see the relevant [SAP community wiki page](https://wiki.scn.sap.com/wiki/display/Security/Securing+Connections+to+AS+ABAP+with+SNC).

- **The SAPCAR utility**, downloaded from the SAP Service Marketplace. For more information, see the [SAP Installation Guide](https://help.sap.com/viewer/d1d04c0d65964a9b91589ae7afc1bd45/5.0.4/en-US/467291d0dc104d19bba073a0380dc6b4.html)

For more information, see [Azure Sentinel SAP solution detailed SAP requirements (public preview)](sap-solution-detailed-requirements.md).

## Create your Azure key vault

Create an Azure key vault that you can dedicate to your Azure Sentinel SAP data connector.

Run the following command to create your Azure key vault and grant access to an Azure service principal:

``` azurecli
kvgp=<KVResourceGroup>

kvname=<keyvaultname>

spname=<sp-name>

kvname=<keyvaultname>
# Optional when Azure MI not enabled - Create sp user for AZ cli connection, save details for env.list file
az ad sp create-for-rbac –name $spname

SpID=$(az ad sp list –display-name $spname –query “[].appId” --output tsv

#Create key vault
az keyvault create \
  --name $kvname \
  --resource-group $kvgp

# Add access to SP
az keyvault set-policy --name $kvname --resource-group $kvgp --object-id $spID --secret-permissions get list set
```

For more information, see [Quickstart: Create a key vault using the Azure CLI](../key-vault/general/quick-create-cli.md).

## Add Azure Key Vault secrets

To add Azure Key Vault secrets, run the following script, with your own system ID and the credentials you want to add:

```azurecli
#Add Azure Log ws ID
az keyvault secret set \
  --name <SID>-LOG_WS_ID \
  --value "<logwsod>" \
  --description SECRET_AZURE_LOG_WS_ID --vault-name $kvname

#Add Azure Log ws public key
az keyvault secret set \
  --name <SID>-LOG_WS_PUBLICKEY \
  --value "<loswspubkey>" \
  --description SECRET_AZURE_LOG_WS_PUBLIC_KEY --vault-name $kvname
```

For more information, see the [az keyvault secret](/cli/azure/keyvault/secret) CLI documentation.

## Deploy the SAP data connector

This procedure describes how to deploy the SAP data connector on a VM when connecting via SNC.

We recommend that you perform this procedure after you have a [key vault](#create-your-azure-key-vault) ready with your [SAP credentials](#add-azure-key-vault-secrets).

**To deploy the SAP data connector**:

1. On your data connector VM, download the latest SAP NW RFC SDK from the [SAP Launchpad site](https://support.sap.com) > **SAP NW RFC SDK** > **SAP NW RFC SDK 7.50** > **nwrfc750X_X-xxxxxxx.zip**.

    > [!NOTE]
    > You'll need your SAP user sign-in information in order to access the SDK, and you must download the SDK that matches your operating system.
    >
    > Make sure to select the **LINUX ON X86_64** option.

1. Create a new folder with a meaningful name, and copy the SDK zip file into your new folder.

1. Clone the Azure Sentinel solution GitHub repo onto your data connector VM, and copy Azure Sentinel SAP solution **systemconfig.ini** file into your new folder.

    For example:

    ```bash
    mkdir /home/$(pwd)/sapcon/<sap-sid>/
    cd /home/$(pwd)/sapcon/<sap-sid>/
    wget  https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.ini
    cp <**nwrfc750X_X-xxxxxxx.zip**> /home/$(pwd)/sapcon/<sap-sid>/
    ```

1. Edit the **systemconfig.ini** file as needed, using the embedded comments as a guide.

    You'll need to edit all configurations except for the key vault secrets. For more information, see [Manually configure the SAP data connector](sap-solution-deploy-alternate.md#manually-configure-the-sap-data-connector).

1. Define the logs that you want to ingest into Azure Sentinel using the instructions in the **systemconfig.ini** file. 

    For example, see [Define the SAP logs that are sent to Azure Sentinel](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-azure-sentinel).

    > [!NOTE]
    > Relevant logs for SNC communications are only those logs that are retrieved via the NetWeaver / ABAP interface. SAP Control and HANA logs are out of scope for SNC.
    >

1. Define the following configurations using the instructions in the **systemconfig.ini** file:

    - Whether to include user email addresses in audit logs
    - Whether to retry failed API calls
    - Whether to include cexal audit logs
    - Whether to wait an interval of time between data extractions, especially for large extractions

    For more information, see [SAL logs connector configurations](sap-solution-deploy-alternate.md#sal-logs-connector-settings).

1. Save your updated **systemconfig.ini** file in the **sapcon** directory on your VM.

1. Download and run the pre-defined Docker image with the SAP data connector installed.  Run:

    ```bash
    docker pull docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest-preview
    docker create -v $(pwd):/sapcon-app/sapcon/config/system -v /home/azureuser /sap/sec:/sapcon-app/sec --env SCUDIR=/sapcon-app/sec --name sapcon-snc mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest-preview
    ```


## Post-deployment SAP system procedures

After deploying your SAP data connector, perform the following SAP system procedures:

1. Download the SAP Cryptographic Library from the [SAP Service Marketplace](https://launchpad.support.sap.com/#/) > **Software Downloads** > **Browse our Download Catalog** > **SAP Cryptographic Software**.

    For more information, see the [SAP Installation Guide](https://help.sap.com/viewer/d1d04c0d65964a9b91589ae7afc1bd45/5.0.4/en-US/86921b29cac044d68d30e7b125846860.html).

1. Use the SAPCAR utility to extract the library files, and deploy them to your SAP data connector VM, in the `<sec>` directory.

1. Verify that you have permissions to run the library files.

1. Define an environment variable named **SECUDIR**, with a value of the full path to the `<sec>` directory.

1. Create a personal security environment (PSE). The **sapgenspe** command-line tool is available in your `<sec>` directory on your SAP data connector VM.

    For example:

    ```bash
    ./sapgenpse get_pse -p my_pse.pse -noreq -x my_pin "CN=sapcon.com, O=my_company, C=IL"
    ```

    For more information, see [Creating a Personal Security Environment](https://help.sap.com/viewer/4773a9ae1296411a9d5c24873a8d418c/8.0/en-US/285bb1fda3fa472c8d9205bae17a6f95.html) in the SAP documentation.

1. Create credentials for your PSE. For example:

    ```bash
    ./sapgenpse seclogin -p my_pse.pse -x my_pin -O MXDispatcher_Service_User
    ```

    For more information, see [Creating Credentials](https://help.sap.com/viewer/4773a9ae1296411a9d5c24873a8d418c/8.0/en-US/d8b50371667740e797e6c9f0e9b7141f.html) in the SAP documentation.

1. Exchange the Public-Key certificates between the Identity Center and the AS ABAP's SNC PSE.

    For example, to export the Identity Center's Public-Key certificate, run:

    ```bash
    ./sapgenpse export_own_cert -o my_cert.crt -p my_pse.pse -x abcpin
    ```

    Import the certificate to the AS ABAP's SNC PSE, export it from the PSE, and then import it back to the Identity Center.

    For example, to import the certificate to the Identity Center, run:

    ```bash
    ./sapgenpse maintain_pk -a full_path/my_secure_dir/my_exported_cert.crt -p my_pse.pse -x my_pin
    ```

    For more information, see [Exchanging the Public-Key Certificates](https://help.sap.com/viewer/4773a9ae1296411a9d5c24873a8d418c/8.0/en-US/7bbf90b29c694e6080e968559170fbcd.html) in the SAP documentation.


## Edit the SAP data connector configuration

1. On your SAP data connector VM, navigate to the **systemconfig.ini** file and define the following parameters with the relevant values:

    ```ini
    [Secrets Source]
    secrets = AZURE_KEY_VAULT
    ```

1. In your [Azure key vault](#create-your-azure-key-vault), generate the following secrets:

    - `<Interprefix>-ABAPSNCPARTNERNAME`, where the value is the `<Relevant DN details>`
    - `<Interprefix>-ABAPSNCLIB`, where the value is the `<lib_Path>`
    - `<Interprefix>-ABAPX509CERT`, where the value is the `<Certificate_Code>)`

    For example:

    ```ini
    S4H-ABAPSNCPARTNERNAME  =  'p:CN=help.sap.com, O=SAP_SE, C=IL' (Relevant DN)
    S4H-ABAPSNCLIB = 'home/user/sec-dir' (Relevant directory)
    S4H-ABAPX509CERT = 'MIIDJjCCAtCgAwIBAgIBNzA ... NgalgcTJf3iUjZ1e5Iv5PLKO' (Relevant certificate code)
    ```

    > [!NOTE]
    > By default, the `<Interprefix>` value is your SID, such as `A4H-<ABAPSNCPARTNERNAME>`.
    >

If you're entering secrets directly to the configuration file, define the parameters as follows:

```ini
[Secrets Source]
secrets = DOCKER_FIXED
[ABAP Central Instance]
snc_partnername =  <Relevant_DN_Deatils>
snc_lib =  <lib_Path>
x509cert = <Certificate_Code>
For example:
snc_partnername =  p:CN=help.sap.com, O=SAP_SE, C=IL (Relevant DN)
snc_lib = /sapcon-app/sec/libsapcrypto.so (Relevant directory)
x509cert = MIIDJjCCAtCgAwIBAgIBNzA ... NgalgcTJf3iUjZ1e5Iv5PLKO (Relevant certificate code)
```

### Attach the SNC parameters to your user

1. On your SAP data connector VM, call the `SM30` transaction and select to maintain the `USRACLEXT` table.

1. Add a new entry. In the **User** field, enter the communication user that's used to connect to the ABAP system.

1. Enter the SNC name when prompted. The SNC name is the unique, distinguished name provided when you created the Identity Manager PSE. For example: `CN=IDM, OU=SAP, C=DE`

    Make sure to add a `p` before the SNC name. For example: `p:CN=IDM, OU=SAP, C=DE`.

1. Select **Save**.

SNC is enabled on your data connector VM.

## Activate the SAP data connector

This procedure describes how to activate the SAP data connector using the secured SNC connection you created using the procedures earlier in this article.

1. Activate the docker image:

    ```bash
    docker start sapcon-<SID>
    ```

1. Check the connection. Run:

    ```bash
    docker logs sapcon-<SID>
    ```

1. If the connection fails, use the logs to understand the issue.

    If you need to, disable the docker image:

    ```bash
    docker stop sapcon-<SID>
    ```

For example, issues may occur because of a misconfiguration in the **systemconfig.ini** file, or in your Azure key vault, or some of the steps for creating a secure connection via SNC weren't run correctly.

Try performing the steps above again to configure a secure connection via SNC. For more information, see also [Troubleshooting your Azure Sentinel SAP solution deployment](sap-deploy-troubleshoot.md).

## Next steps

After your SAP data connector is activated, continue by deploying the **Azure Sentinel - Continuous Threat Monitoring for SAP** solution. For more information, see [Deploy SAP security content](sap-deploy-solution.md#deploy-sap-security-content).

Deploying the solution enables the SAP data connector to display in Azure Sentinel and deploys the SAP workbook and analytics rules. When you're done, manually add and customize your SAP watchlists.

For more information, see:

- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Azure Sentinel SAP solution: security content reference](sap-solution-security-content.md)

