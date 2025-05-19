---
title: Use Multiple Certificates in Azure Load Testing
titleSuffix: Azure Load Testing
description: Learn how to configure and use multiple certificates securely in Azure Load Testing with a JKS file and Key Vault integration.
services: load-testing
ms.service: azure-load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/24/2025
ms.topic: how-to
---


# Using multiple certificates in Azure Load Testing

Azure Load Testing supports the use of multiple certificates for secure communication during load testing scenarios. This article explains how to consolidate multiple certificates into a Java KeyStore (JKS) file, securely store the keystore password in Azure Key Vault (AKV), and configure Azure Load Testing to use the JKS file.

## Prerequisites
Before you begin, ensure the following:
- You have an [Azure Key Vault](https://jmeter-plugins.org/wiki/PluginsManager/) instance set up to store secrets.
- You have the [Managed Identity (MI)](./how-to-use-a-managed-identity.md) of your Azure Load Testing resource configured.
- You have created a [Java KeyStore (JKS)](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) file containing all required certificates. 
- You have stored the JKS password as a secret in Azure Key Vault.

## Steps to configure multiple certificates

### Step 1: Create and secure the JKS file
1.	Use the **keytool utility** to create a JKS file and import all necessary certificates.
    ```Terminal
    keytool -importcert -file <certificate-file> -keystore <keystore-name>.jks -alias <alias-name>
    ```
1.	Store the JKS file's password as a secret in Azure Key Vault: 
    - Open the Azure portal and navigate to your Key Vault.
    - Select **Objects > Secrets > Generate/Import**.
    - Enter a name and the password for the JKS file, then click **Create**.
  	
### Step 2: Assign access to the Azure Load Testing managed identity
1.	In the Azure portal, go to your Azure Key Vault resource and select **Access Policies** from the left pane, then click **+ Create**.
1.	On the Permissions tab:
    - Under **Secret permissions**, select **Get**.
    - Click **Next**.
1.	On the **Principal** tab:
    - Search for and select the managed identity for the load testing resource.
    - Click **Next**.
    - If you're using a system-assigned managed identity, the managed identity name matches that of your Azure Load Testing resource.
1.	Click **Next** again to complete the access policy configuration.
  
When your test runs, the managed identity associated with your load testing resource can now read the secret for your load test from your Key Vault.
Now that you've added a secret in Azure Key Vault and configured a secret for your load test, move to use secrets in Apache JMeter.

### Step 3: Use keystore configuration and JSR223 PreProcessor
**Keystore configuration**

1. In your JMeter script, add the **Keystore Configuration** element to manage SSL certificates.
   - Go to **Test Plan > Add > Config Element > Keystore Configuration**.
   - Set the Alias field to match the certificate alias in your JKS file.
     
**JSR223 PreProcessor for dynamic SSL configuration**

1.	Add a **JSR223 PreProcessor** to dynamically configure the SSL properties at runtime.
       - Go to **Thread Group > Add > PreProcessors > JSR223 PreProcessor**.
       - Set the language to Java.
       - Add the following script:
         ```Terminal
         System.setProperty("javax.net.ssl.keyStoreType", "PKCS12");
         System.setProperty("javax.net.ssl.keyStore", "<path-to-your-keystore>");
         System.setProperty("javax.net.ssl.keyStorePassword", "<keystore-password>");
         ```
1.	Replace `path-to-your-keystore` and `keystore-password` with your actual keystore file path and password.

### Step 4: Add a CSV data set config to iterate over certificates
1.	In your JMeter script, add a **CSV Data Set Config** element to iterate over the certificates in your JKS file.
    - Go to **Test Plan > Add > Config Element > CSV Data Set Config**.
    - Configure the following fields:
        - Filename: Path to the CSV file containing certificate aliases.
        - Variable Names: Name of the variable (e.g., certificateAlias).
1.	Create a CSV file with a list of certificate aliases from your JKS file. Each alias should be on a new line.
1.	Use the variable (e.g., ${certificateAlias}) in the Keystore Configuration or scripts to dynamically reference the current certificate alias during the test execution.

### Step 5: Upload test files
1.	In the Azure portal, navigate to your Azure Load Testing resource and start a new test creation workflow.
1.	Upload the following files:
       - The JKS file.
       - Your JMeter test script.
       - The CSV file with certificate aliases.
     
### Step 6: Configure parameters
1.	Go to the **Parameters** tab in the test creation workflow.
1.	Add a secret for the JKS password:
       - Name: The name of the secret in Azure Key Vault.
       - Value: The Key Vault URL (e.g., https://`key-vault-name`.vault.azure.net/secrets/`secret-name`).
1.  Configure the **Key Vault reference identity**, by specifying the Managed Identity of the Azure Load Testing resource that will access the Key Vault secret.
       
Review all configurations to ensure correctness. Click **Create Test** to finalize and run the test.
   
## Related content

* [Use a Managed Identity in Azure Load Testing](./how-to-use-a-managed-identity.md)

* [Test secure endpoints in Azure Load Testing](./how-to-test-secured-endpoints.md)
