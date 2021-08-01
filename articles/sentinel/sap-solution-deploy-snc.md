---
title: Deploy the Azure Sentinel SAP data connector with SNC  | Microsoft Docs
description: Learn how to deploy the Azure Sentinel data connector for SAP environments with a secure connection via SNC.
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.custom: mvc
ms.date: 08/01/2021
ms.subservice: azure-sentinel

---

# Deploy the Azure Sentinel SAP data connector with SNC

This article describes how to deploy the Azure Sentinel SAP data connector when you have a secure connection to SAP via Secure Network Communications (SNC).

> [!NOTE]
> The default, and most recommended process for deploying the Azure Sentinel SAP data connector is by [using an Azure VM](sap-deploy-solution.md). This article is intended for advanced users.

> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

The basic prerequisites for deploying your Azure Sentinel SAP data connector are the same regardless of your deployment method.

Make sure that your system complies with the prerequisites documented in the main [SAP data connector deployment procedure](sap-deploy-solution.md#prerequisites) before you start.

Additionally, when working with SNC, you also need:

- A secure connection to SAP with SNC. Define the connection-specific SNC parameters in the repository constants for the AS ABAP system you're connecting to. For more information, see the relevant [SAP community wiki page](https://wiki.scn.sap.com/wiki/display/Security/Securing+Connections+to+AS+ABAP+with+SNC).

- The SAPCAR utility, downloaded from the SAP Service Marketplace. For more information, see the [SAP Installation Guide](https://help.sap.com/viewer/d1d04c0d65964a9b91589ae7afc1bd45/5.0.4/en-US/467291d0dc104d19bba073a0380dc6b4.html)

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

This procedure describes how to deploy the SAP data connector specifically when connecting via SNC.

We recommend that you perform this procedure after you have a key vault ready with your SAP credentials.

**To deploy the SAP data connector**:

1. On your data connector machine or VM, download the latest SAP NW RFC SDK from the [SAP Launchpad site](https://support.sap.com) > **SAP NW RFC SDK** > **SAP NW RFC SDK 7.50** > **nwrfc750X_X-xxxxxxx.zip**.

    > [!NOTE]
    > You'll need your SAP user sign-in information in order to access the SDK, and you must download the SDK that matches your operating system.
    >
    > Make sure to select the **LINUX ON X86_64** option.

1. Create a new folder with a meaningful name, and copy the SDK zip file into your new folder.

1. Clone the Azure Sentinel solution GitHub repo onto your data connector machine, and copy Azure Sentinel SAP solution **systemconfig.ini** file into your new folder.

    For example:

    ```bash
    mkdir /home/$(pwd)/sapcon/<sap-sid>/
    cd /home/$(pwd)/sapcon/<sap-sid>/
    wget  https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.ini
    cp <**nwrfc750X_X-xxxxxxx.zip**> /home/$(pwd)/sapcon/<sap-sid>/
    ```

1. Edit the **systemconfig.ini** file as needed, using the embedded comments as a guide. For more information, see [Manually configure the SAP data connector](#manually-configure-the-sap-data-connector).

1. Define the logs that you want to ingest into Azure Sentinel using the instructions in the **systemconfig.ini** file. For example, see [Define the SAP logs that are sent to Azure Sentinel](#define-the-sap-logs-that-are-sent-to-azure-sentinel).

1. Define the following configurations using the instructions in the **systemconfig.ini** file:

    - Whether to include user email addresses in audit logs
    - Whether to retry failed API calls
    - Whether to include cexal audit logs
    - Whether to wait an interval of time between data extractions, especially for large extractions

    For more information, see [SAL logs connector configurations](#sal-logs-connector-settings).

1. Save your updated **systemconfig.ini** file in the **sapcon** directory on your machine.

1. Download and run the pre-defined Docker image with the SAP data connector installed.  Run:

    ```bash
    docker pull docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest-preview
    docker create -v $(pwd):/sapcon-app/sapcon/config/system -v /home/azureuser /sap/sec:/sapcon-app/sec --env SCUDIR=/sapcon-app/sec --name sapcon-snc mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest-preview
    ```


## Download the SAP Cryptographic Library

1. Download the SAP SAP Cryptographic library from SAP Service Marketplace. For more information, see the [SAP Installation Guide](https://help.sap.com/viewer/d1d04c0d65964a9b91589ae7afc1bd45/5.0.4/en-US/86921b29cac044d68d30e7b125846860.html), and use the SAPCAR utility to extract the library files.

1. Deploy the SAP Cryptographic Library files on your SAP connector VM.

1. Verify that you have permissions to run the library files.

1. Define an environment variable named **SECUDIR**, with a value of the full path to the directory hosting the library files.

## Create a personal security environment (PSE)

1. On your data connector machine or VM, from the command line, open the **sapgenpse** command line tool:

    TBD.

1. Create a PSE for your server in the `<sec>` directory. Run:

    ```bash
    ./sapgenpse get_pse [-p <PSE_name>] [-x <PIN>] [DN]
    ```

Where:

- `-p <PSE_name>` = Path and file name for the server's PSE.
- `-x <PIN>` = PIN to protect the PSE.
- `DN` = Distinguished Name for the server, used to build the server's SNC name.

The Distinguished Name includes the following elements:

- `CN` = Common_Name (such as help.sap.com)
- `OU` = Organizational_Unit (such as my unit)
- `O` = Organization (such as SAP_SE)
- `C` = Country (such as DE)

For example:

```bash
./sapgenpse get_pse -p my_pse.pse -noreq -x my_pin "CN=sapcon.com, O=my_company, C=IL"
```

## Create PSE credentials

Use the following command to open the server's PSE and create credentials:

```bash
./sapgenpse seclogin [-p <PSE_name>] [-x <PIN>] [-O [<NT_Domain>\]<user_ID>]
```

where:

- `-p <PSE_name>` = Path and file name for the server's PSE.
- `-x <PIN>` = PIN to protect the PSE.
- `-o [<NT_Domain>] \<user_ID>` = User for which the credentials are created. (The user that runs the dispatcher service.)

For example:

```bash
./sapgenpse seclogin -p my_pse.pse -x my_pin -O MXDispatcher_Service_User
```

## Exchange the public key certificates

### Exporting the Identity Center’s Public-Key Certificate
In your SAP connector VM, enter to <sec>.
Use the tool's command export_own_cert to export the server's certificate:
./sapgenpse export_own_cert -o <output_file> -p <PSE_name> [- x <PIN>]
Where:
•	-o <output_file> = Exports the certificate named as the output_file.
•	-p <PSE_name> = Path and file name for the server's PSE.
•	-x <PIN> = PIN to protect the PSE.
For example:
./sapgenpse export_own_cert -o my_cert.crt -p my_pse.pse -x abcpin

### Importing the Identity Center’s Public-Key Certificate Into the AS ABAP’s SNC PSE
1.	Login to SAP with your user.
2.	Enter to the trust manager on the AS ABAP using STRUST transaction.
3.	Select the SNC PSE with double click.
4.	Choose Certificate -> Import from the menu or the symbol for Import certificate.
5.	In the dialog that follows, enter the path and file name of the Identity Center’s public-key certificate file, select the Base64 format, and choose Enter.
6.	The certificate appears in the Certificate section of the trust manager’s screen.
7.	Choose Add to Certificate List to add the certificate to the AS ABAP’s SNC PSE.
8.	Press save. (If not, changes will be lost)
 


### Exporting the AS ABAP’s Public-Key Certificate
1.	Make sure the SNC PSE is still the selected PSE.
2.	Select the certificate shown in the Owner field with a double-click.
3.	Information about the certificate appears in the Certificate section.
4.	Choose Certificate -> Export from the menu or the symbol for Export certificate.
5.	In the dialog that follows, enter the path and file name where you want to save the file, select the Base64 format and choose Enter.
6.	The file is saved to the file system.

### Importing the AS ABAP’s Public-Key Certificate Into the Identity Center’s PSE

In your SAP connector VM, enter to <sec>.
Use the tool's command maintain_pk to import the AS ABAP’s public-key certificate into the Identity Center PSE’s certificate list.
./sapgenpse maintain_pk [-a <cert_file>] -p <PSE_name> [-x <PIN>]
Where:
•	-a <cert_file> = Add certificate from file <cert_file> to the certificate list.
•	-p <PSE_name> = Path and file name for the server's PSE.
•	-x <PIN> = PIN that protects the PSE.
For example:
./sapgenpse maintain_pk -a full_path/my_secure_dir/my_exported_cert.crt -p my_pse.pse -x my_pin

## Edit Configurations

Docker Fixed:
In the SAP connector VM there is a file named “systemconfig.ini”, you should set those parameters with your relevant values:
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

Azure Key Vault:
In the SAP connector VM there is a file named “systemconfig.ini”, you should set those parameters with your relevant values:
[Secrets Source]
secrets = AZURE_KEY_VAULT

1.	Enter to your Azure Key Vault -> Secrets.
2.	Generate those secrets:
•	<Interprefix>-ABAPSNCPARTNERNAME  (value: <Relevant_DN_Deatils>)
•	<Interprefix>-ABAPSNCLIB (value: <lib_Path>)
•	<Interprefix>-ABAPX509CERT (value: <Certificate_Code>)
For example:
S4H-ABAPSNCPARTNERNAME  =  'p:CN=help.sap.com, O=SAP_SE, C=IL' (Relevant DN)
S4H-ABAPSNCLIB = 'home/user/sec-dir' (Relevant directory)
S4H-ABAPX509CERT = 'MIIDJjCCAtCgAwIBAgIBNzA ... NgalgcTJf3iUjZ1e5Iv5PLKO' (Relevant certificate code)
Attach SNC Parameters to User
1.	 Call transaction SM30 and maintain table USRACLEXT. 
2.	Add a new entry -> enter the communication user used to connect to the ABAP system in the user field. 
3.	The SNC name will be the unique distinguished name name given when the IDM PSE was created eg CN=IDM, OU=SAP, C=DE . Make sure to place a p: before the SNC name ie p:CN=IDM, OU=SAP, C=DE.
4.	Press save.
5.	SNC is now enabled.

 

Use the SAP Connector
After you finished the steps above, now we can try to activate the connector. (With secured SNC connection)
1.	Activate docker image by “docker start sapcon-<SID>”. (where <SID> is your system ID)
2.	Check the connection with “docker logs sapcon-<SID>”. (where <SID is your system ID)
3.	If the connection failed:
a.	Try to diagnose what is the problem in the logs.
b.	Disable docker image by “docker stop sapcon-<SID>”. (where <SID> is your system ID)
c.	The problem may appear for some reasons:
i.	Parameters are not configured properly in systemconfig.ini or in Azure Key Vault.
ii.	Some of the steps to configure secure connection via SNC didn’t executed properly. (Try to repeat the steps)



## Create a personal security environment (PSE)

## Next steps

Continue with deploying the **Azure Sentinel - Continuous Threat Monitoring for SAP** solution.

Deploying the solution enables the SAP data connector to display in Azure Sentinel and deploys the SAP workbook and analytics rules. When you're done, manually add and customize your SAP watchlists.

For more information, see [Deploy SAP security content](sap-deploy-solution.md#deploy-sap-security-content).

For more information, see:

- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Azure Sentinel SAP solution: security content reference](sap-solution-security-content.md)

