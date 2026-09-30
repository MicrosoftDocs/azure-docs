---
title: Restrictions on Hardcoded Credentials
description: Explains what standards and restrictions are in place for Azure Applications templates with regards to credentials.
ms.topic: how-to
ms.date: 08/21/2025
---

# Restrictions on hardcoded credentials

Azure Applications enforces strict security policies prohibiting the use of hardcoded credentials (for example, usernames, passwords, keys, SAS URIs) in managed applications and solution templates. This restriction is mandated under [Marketplace Certification Policy 300.4.4 Parameters](/legal/marketplace/certification-policies#30044-parameters).

## Security risks of hardcoded credentials

Hardcoded credentials pose significant risks: 
- They can be exploited by attackers to gain unauthorized access to deployed resources
- They violate secure coding practices and compromise customer trust

As a result, any secrets present in the template are at risk for exposure and can't be considered secure.

## Managing credentials in ARM templates

- Managed Applications (only if management access is enabled): [Use Azure Key Vault when deploying Managed Applications](./key-vault-access.md).
- Solution templates: Credentials have to be parameterized and provided by the customer. If for any reason this isn't possible, then they should be randomly generated in the template and shouldn't be guessable.
  - Implement [parameters in templates](../templates/parameters.md)
  - Variables used for credentials or secrets shouldn't use plaintext strings.
  - The use of the ```uniquestring``` function is deterministic for an input and doesn't meet the requirement that the password isn't guessable. [Template functions](../templates/template-functions-string.md#uniquestring).
  - Any password string must NOT be concatenated with any plaintext string. For example, [concat(parameters('password')), 'plaintext')] is an invalid password. This is to avoid padding the string to bypass password length requirements.
  - If there's a hardcoded SAS URI, then it's as good as a public link. The publisher can either create a public link or package the resource with the zip file and reference it using [referenced linked templates and artifacts](./artifacts-location.md).

## Credential examples

Hardcoded credential:
- ```"adminPassword": "fixedValue"```

Guessable passwords:
- ```"adminPassword": "[concat(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')), 'fixedvalue')]"```

SAS URIs:
- ```https://<storage_account>.blob.core.windows.net/<container>/<blob_name>?sv=2022-11-02&st=2025-08-20T09%3A00%3A00Z&se=2025-08-20T10%3A00%3A00Z&sr=b&sp=r&sig=<signature>```

API keys/Storage keys:
- ```api_key = "12345abcde67890xyz12345abcde67890"```

## References

To learn more about Marketplace policies, refer to the [Commercial marketplace certification policies](/legal/marketplace/certification-policies) documentation.
