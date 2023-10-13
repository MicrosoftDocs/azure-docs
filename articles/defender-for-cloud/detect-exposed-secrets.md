---
title: Detect exposed secrets in code

description: Prevent passwords and other secrets that may be stored in your code from being accessed by outside individuals by using Defender for Cloud's secret scanning for Defender for DevOps.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 01/31/2023
---

# Detect exposed secrets in code

When passwords and other secrets are stored in source code, it poses a significant risk and could compromise the security of your environments. Defender for Cloud offers a solution by using secret scanning to detect credentials, secrets, certificates, and other sensitive content in your source code and your build output. Secret scanning can be run as part of the Microsoft Security DevOps for Azure DevOps extension. To explore the options available for secret scanning in GitHub, learn more [about secret scanning](https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/about-secret-scanning) in GitHub.

> [!NOTE]
> Effective September 2023, the Secret Scanning option (CredScan) within Microsoft Security DevOps (MSDO) Extension for Azure DevOps will be deprecated. MSDO Secret Scanning will be replaced by the [Configure GitHub Advanced Security for Azure DevOps features - Azure Repos](/azure/devops/repos/security/configure-github-advanced-security-features#set-up-secret-scanning) offering.

Check the list of supported [file types](concept-credential-scanner-rules.md#supported-file-types), [exit codes](concept-credential-scanner-rules.md#supported-exit-codes) and [rules and descriptions](concept-credential-scanner-rules.md#rules-and-descriptions).

## Prerequisites

- An Azure subscription. If you don't have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md)

## Setup secret scanning in Azure DevOps

You can run secret scanning as part of the Azure DevOps build process by using the Microsoft Security DevOps (MSDO) Azure DevOps extension.

**To add secret scanning to Azure DevOps build process**:

1. Sign in to [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Pipeline**.

1. Locate the pipeline with MSDO Azure DevOps Extension is configured.

1. Select **Edit**.

1. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'secrets'
    ```

1.  Select **Save**.

By adding the additions to your yaml file, you'll ensure that secret scanning only runs when you execute a build to your Azure DevOps pipeline.

## Remediate secrets findings

When credentials are discovered in your code, you can remove them. Instead you can use an alternative method that won't expose the secrets directly in your source code. Some of the best practices that exist to handle this type of situation include:

- Eliminating the use of credentials (if possible).

- Using secret storage such as Azure Key Vault (AKV).

- Updating your authentication methods to take advantage of managed identities (MSI) via Microsoft Entra ID.
  
### Remediate secrets findings using Azure Key Vault

1. Create a [key vault using PowerShell](../key-vault/general/quick-create-powershell.md).

1. [Add any necessary secrets](../key-vault/secrets/quick-create-net.md) for your application to your Key Vault.

1. Update your application to connect to Key Vault using managed identity with one of the following:

    - [Azure Key Vault for App Service application](../key-vault/general/tutorial-net-create-vault-azure-web-app.md)
    - [Azure Key Vault for applications deployed to a VM](../key-vault/general/tutorial-net-virtual-machine.md)

Once you have remediated findings, you can review the [Best practices for using Azure Key Vault](../key-vault/general/best-practices.md).

### Remediate secrets findings using managed identities

Before you can remediate secrets findings using managed identities, you need to ensure that the Azure resource you're authenticating to in your code supports managed identities. You can check the full list of [Azure services that can use managed identities to access other services](../active-directory/managed-identities-azure-resources/managed-identities-status.md).

If your Azure service is listed, you can [manage your identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).


## Suppress false positives

When the scanner runs, it may detect credentials that are false positives. Inline-suppression tools can be used to suppress false positives. 

Some reasons to suppress false positives include:

- Fake or mocked credentials in the test files. These credentials can't access resources.

- Placeholder strings. For example, placeholder strings may be used to initialize a variable, which is then populated using a secret store such as AKV.

- External library or SDKs that 's directly consumed. For example, openssl.

- Hard-coded credentials for an ephemeral test resource that only exists for the lifetime of the test being run.

- Self-signed certificates that are used locally and not used as a root. For example, they may be used when running localhost to allow HTTPS.

- Source-controlled documentation with non-functional credential for illustration purposes only

- Invalid results. The output isn't a credential or a secret.

You may want to suppress fake secrets in unit tests or mock paths, or inaccurate results. We don't recommend using suppression to suppress test credentials. Test credentials can still pose a security risk and should be securely stored.

> [!NOTE]
> Valid inline suppression syntax depends on the language, data format and CredScan version you are using. 

Credentials that are used for test resources and environments shouldn't be suppressed. They're being used to demonstration purposes only and don't affect anything else. 

### Suppress a same line secret

To suppress a secret that is found on the same line, add the following code as a comment at the end of the line that has the secret:

```bash
#[SuppressMessage("Microsoft.Security", "CS001:SecretInLine", Justification="... .")]
```

### Suppress a secret in the next line 

To suppress the secret found in the next line, add the following code as a comment before the line that has the secret:

```bash
#[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="... .")]
```

## Next steps
+ Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud to remediate secrets in code before they're shipped to production.
