---
title: Monitor and manage certificate creation
description: Scenarios demonstrating a range of options for creating, monitoring, and interacting with the certificate creation process with Key Vault.
services: key-vault
author: msmbaldwin
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 01/07/2019
ms.author: mbaldwin

---

# Monitor and manage certificate creation
Applies To: Azure

The following 

The scenarios / operations outlined in this article are:

- Request a KV Certificate with a supported issuer
- Get pending request - request status is "inProgress"
- Get pending request - request status is "complete"
- Get pending request - pending request status is "canceled" or "failed"
- Get pending request - pending request status is "deleted" or "overwritten"
- Create (or Import) when pending request exists - status is "inProgress"
- Merge when pending request is created with an issuer (DigiCert, for example)
- Request a cancellation while the pending request status is "inProgress"
- Delete a pending request object
- Create a KV certificate manually
- Merge when a pending request is created - manual certificate creation

## Request a KV Certificate with a supported issuer 

|Method|Request URI|
|------------|-----------------|
|POST|`https://mykeyvault.vault.azure.net/certificates/mycert1/create?api-version={api-version}`|

The following examples require an object named "mydigicert" to already be available in your key vault with the issuer provider as DigiCert. The certificate issuer is an entity represented in Azure Key Vault (KV) as a CertificateIssuer resource. It is used to provide information about the source of a KV certificate; issuer name, provider, credentials, and other administrative details.

### Request

```json
{
  "policy": {
    "x509_props": {
      "subject": "CN=MyCertSubject1"
    },
    "issuer": {
      "name": "mydigicert",
      "cty": "OV-SSL",
    }
  }
}
```

### Response

```
StatusCode: 202, ReasonPhrase: 'Accepted'
Location: “https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "mydigicert"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": false,
  "status": "InProgress",
  "status_details": "Pending certificate created. Certificate request is in progress. This may take some time based on the issuer provider. Please check again later",
  "request_id": "a76827a18b63421c917da80f28e9913d"
}

```

## Get pending request - request status is "inProgress"

|Method|Request URI|
|------------|-----------------|
|GET|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

### Request
GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

> [!NOTE]
> If *request_id* is specified in the query, it acts like a filter. If the *request_id* in the query and in the pending object are different, an http status code of 404 is returned.

### Response

```
StatusCode: 200, ReasonPhrase: 'OK'
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "{issuer-name}"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": false,
  "status": "inProgress",
  "status_details": "…",
  "request_id": "a76827a18b63421c917da80f28e9913d"
}

```

## Get pending request - request status is "complete"

### Request

|Method|Request URI|
|------------|-----------------|
|GET|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

### Response

```
StatusCode: 200, ReasonPhrase: 'OK'
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "{issuer-name}"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": false,
  "status": "completed",
  "request_id": "a76827a18b63421c917da80f28e9913d",
  "target": “https://mykeyvault.vault.azure.net/certificates/mycert1?api-version={api-version}"
}

```

## Get pending request - pending request status is "canceled" or "failed"

### Request

|Method|Request URI|
|------------|-----------------|
|GET|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

### Response

```
StatusCode: 200, ReasonPhrase: 'OK'
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "{issuer-name}"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": false,
  "status": "failed",
  "status_details": "",
  "request_id": "a76827a18b63421c917da80f28e9913d",
  "error": {
    "code": "<errorcode>",
    "message": "<message>"
  }
}

```

> [!NOTE]
> The value of the *errorcode* can be "Certificate issuer error" or "Request rejected" based on issuer or user error respectively.

## Get pending request - pending request status is "deleted" or "overwritten"
A pending object can be deleted or overwritten by a create/import operation when its status is not "inProgress."

|Method|Request URI|
|------------|-----------------|
|GET|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

### Request
GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

GET `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

### Response

```
StatusCode: 404, ReasonPhrase: 'Not Found'
{
  "error": {
    "code": "PendingCertificateNotFound",
    "message": "…"
  }
}

```

## Create (or Import) when pending request exists - status is "inProgress"
A pending object has four possible states; "inprogress", "canceled", "failed", or "completed."

When a pending request's state is "inprogress", create (and import) operations will fail with an http status code of 409 (conflict).

To fix a conflict:

- If the certificate is being manually created, you can either complete the KV certificate by doing a merge or delete on the pending object.

- If the certificate is being created with an issuer, you can wait until the certificate completes, fails or is canceled. Alternatively, you can delete the pending object.

> [!NOTE]
> Deleting a pending object may or may not cancel the x509 certificate request with the provider.

|Method|Request URI|
|------------|-----------------|
|POST|`https://mykeyvault.vault.azure.net/certificates/mycert1/create?api-version={api-version}`|

### Request

```json
{
  "policy": {
    "x509_props": {
      "subject": "CN=MyCertSubject1"
    },
    "issuer": {
      "name": "mydigicert"
    }
  }
}
```

### Response

```
StatusCode: 409, ReasonPhrase: 'Conflict'
{
  "error": {
    "code": "Forbidden",
    "message": "A new key vault certificate can not be created or imported while a pending key vault certificate's status is inProgress."
  }
}

```

## Merge when pending request is created with an issuer
Merge is not allowed when a pending object is created with an issuer but is allowed when its state is "inProgress." 

If the request to create the x509 certificate fails or cancels for some reason, and if an x509 certificate can be retrieved by out-of-band means, a merge operation can be done to complete the KV certificate.

|Method|Request URI|
|------------|-----------------|
|POST|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending/merge?api-version={api-version}`|

### Request

```json
{
  "x5c": [ "MIICxTCCAbi………………………trimmed for brevitiy……………………………………………EPAQj8=" ]
}

```

### Response

```json
StatusCode: 403, ReasonPhrase: 'Forbidden'
{
  "error": {
    "code": "Forbidden",
    "message": "Merge is forbidden on pending object created with issuer : <issuer-name> while it is in progess."
  }
}

```

## Request a cancellation while the pending request status is "inProgress"
A cancellation can only be requested. A request may or may not be canceled. If a request is not "inProgress", an http status of 400 (Bad Request) is returned.

|Method|Request URI|
|------------|-----------------|
|PATCH|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

### Request
PATCH `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

PATCH `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

```json
{
  "cancellation_requested": true
}

```

### Response

```
StatusCode: 200, ReasonPhrase: 'OK'
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "{issuer-name}"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": true,
  "status": "inProgress",
  "status_details": "…",
  "request_id": "a76827a18b63421c917da80f28e9913d"
}
```

## Delete a pending request object

> [!NOTE]
> Deleting the pending object may or may not cancel the x509 certificate request with the provider.

|Method|Request URI|
|------------|-----------------|
|DELETE|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}`|

### Request
DELETE `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"`

OR

DELETE `“https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}"`

### Response

```
StatusCode: 200, ReasonPhrase: 'OK'
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "{issuer-name}"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "cancellation_requested": false,
  "status": "inProgress",
  "request_id": "a76827a18b63421c917da80f28e9913d",
}
```

## Create a KV certificate manually
You can create a certificate issued with a CA of your choice through a manual creation process. Set the name of the issuer to “Unknown” or do not specify the issuer field.

|Method|Request URI|
|------------|-----------------|
|POST|`https://mykeyvault.vault.azure.net/certificates/mycert1/create?api-version={api-version}`|

### Request

```json
{
  "policy": {
    "x509_props": {
      "subject": "CN=MyCertSubject1"
    },
    "issuer": {
      "name": "Unknown"
    }
  }
}

```

### Response

```
StatusCode: 202, ReasonPhrase: 'Accepted'
Location: “https://mykeyvault.vault.azure.net/certificates/mycert1/pending?api-version={api-version}&request_id=a76827a18b63421c917da80f28e9913d"
{
  "id": “https://mykeyvault.vault.azure.net/certificates/mycert1/pending",
  "issuer": {
    "name": "Unknown"
  },
  "csr": "MIICq......DD5Lp5cqXg==",
  "status": "inProgress",
  "status_details": "Pending certificate created. Please Perform Merge to complete the request.",
  "request_id": "a76827a18b63421c917da80f28e9913d"
}

```

## Merge when a pending request is created - manual certificate creation

|Method|Request URI|
|------------|-----------------|
|POST|`https://mykeyvault.vault.azure.net/certificates/mycert1/pending/merge?api-version={api-version}`|

### Request

```json
{
  "x5c": [ "MIICxTCCAbi………………………trimmed for brevitiy……………………………………………EPAQj8=" ]
}

```

|Element name|Required|Type|Version|Description|
|------------------|--------------|----------|-------------|-----------------|
|x5c|Yes|array|\<introducing version>|X509 certificate chain as base 64 string array.|

### Response

```
StatusCode: 201, ReasonPhrase: 'Created'
Location: “https://mykeyvault.vault.azure.net/certificates/mycert1?api-version={api-version}"
{
	"id": "https mykeyvault.vault.azure.net/certificates/mycert1/f366e1a9dd774288ad84a45a5f620352",
	"kid": "https:// mykeyvault.vault.azure.net/keys/mycert1/f366e1a9dd774288ad84a45a5f620352",
	"sid": " mykeyvault.vault.azure.net/secrets/mycert1/f366e1a9dd774288ad84a45a5f620352",
	"cer": "……de34534……",
	"x5t": "n14q2wbvyXr71Pcb58NivuiwJKk",
	"attributes": {
		"enabled": true,
		"exp": 1530394215,
		"nbf": 1435699215,
		"created": 1435699919,
		"updated": 1435699919
	},
	"pending": {
		"id": "https:// mykeyvault.vault.azure.net/certificates/mycert1/pending"
	},
	"policy": {
		"id": "https:// mykeyvault.vault.azure.net/certificates/mycert1/policy",
		"key_props": {
			"exportable": false,
			"kty": "RSA",
			"key_size": 2048,
			"reuse_key": false
		},
		"secret_props": {
			"contentType": "application/x-pkcs12"
		},
		"x509_props": {
			"subject": "CN=Mycert1",
			"ekus": ["1.3.6.1.5.5.7.3.1", "1.3.6.1.5.5.7.3.2"],
			"validity_months": 12
		},
		"lifetime_actions": [{
			"trigger": {
				"lifetime_percentage": 80
			},
			"action": {
				"action_type": "EmailContacts"
			}
		}],
		"issuer": {
			"name": "Unknown"
		},
		"attributes": {
			"enabled": true,
			"created": 1435699811,
			"updated": 1435699811
		}
	}
}

```

## See Also
- [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md)
