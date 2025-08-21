---
title: Restrictions on Hardcoded Credentials
description: Explains what standards and restrictions are in place for Azure Applications templates with regards to credentials.
ms.topic: how-to
ms.date: 08/21/2025
---

# Restrictions on Hardcoded Credentials

Azure Applications enforces strict security policies prohibiting the use of hardcoded credentials (for example, usernames, passwords, keys, SAS URIs) in managed applications and solution templates. This restriction is mandated under [Marketplace Certification Policy 300.4.4 Parameters](https://learn.microsoft.com/legal/marketplace/certification-policies#30044-parameters).

## Security Risks of Hardcoded Credentials

Hardcoded credentials pose significant risks: 
- They can be exploited by attackers to gain unauthorized access to deployed resources
- They violate secure coding practices and compromise customer trust

As a result, any secrets present in the template are at risk for exposure and can't be considered secure.

## Managing Credentials in ARM Templates

- Managed Applications (only if management access is enabled): [Use Azure Key Vault when deploying Managed Applications](https://learn.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/key-vault-access).
- Solution templates: Credentials have to be parameterized and provided by the customer. If for any reason this isn't possible, then they should be randomly generated in the template and shouldn't be guessable.
  - Implement [parameters in templates](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/parameters)
  - Variables used for credentials or secrets shouldn't use plaintext strings.
  - The use of the ```uniquestring``` function is deterministic for an input and doesn't meet the requirement that the password isn't guessable. [Template functions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions-string#uniquestring).
  - Any password string must NOT be concatenated with any plaintext string. For example, [concat(parameters('password')), 'plaintext')] is an invalid password. This is to avoid padding the string to bypass password length requirements.
  - If there's a hardcoded SAS URI, then it's as good as a public link. The publisher can either create a public link or package the resource with the zip file and reference it using [referenced linked templates and artifacts](https://learn.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/artifacts-location).

## Credential Examples

Hardcoded credential:
- ```"adminPassword": "fixedValue"```

Guessable passwords:
- ```"adminPassword": "[concat(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')), 'fixedvalue')]"```

SAS URIs:
- ```https://<storage_account>.blob.core.windows.net/<container>/<blob_name>?sv=2022-11-02&st=2025-08-20T09%3A00%3A00Z&se=2025-08-20T10%3A00%3A00Z&sr=b&sp=r&sig=<signature>```

API Keys/Storage keys:
- ```api_key = "12345abcde67890xyz12345abcde67890"```

## References

To learn more about Marketplace policies, refer to the [Commercial marketplace certification policies](https://learn.microsoft.com/legal/marketplace/certification-policies) documentation.
