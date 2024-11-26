---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 11/05/2024
 ms.author: normesta
---

| Property | Description |
|:--- |:---|
|**identity / type** | The type of authentication that was used to make the request. <br> For example: `OAuth`, `Kerberos`, `SAS Key`, `Account Key`, or `Anonymous` |
|**identity / tokenHash**|The SHA-256 hash of the authentication token used on the request. <br>When the authentication type is `Account Key`, the format is "key1 \| key2 (SHA256 hash of the key)". <br> For example: `key1(5RTE343A6FEB12342672AFD40072B70D4A91BGH5CDF797EC56BF82B2C3635CE)`. <br>When authentication type is `SAS Key`, the format is "key1 \| key2 (SHA 256 hash of the key),SasSignature(SHA 256 hash of the SAS token)". <br> For example: `key1(0A0XE8AADA354H19722ED12342443F0DC8FAF3E6GF8C8AD805DE6D563E0E5F8A),SasSignature(04D64C2B3A704145C9F1664F201123467A74D72DA72751A9137DDAA732FA03CF)`. When authentication type is `OAuth`, the format is "SHA 256 hash of the OAuth token". <br> For example: `B3CC9D5C64B3351573D806751312317FE4E910877E7CBAFA9D95E0BE923DD25C`<br> For other authentication types, there is no tokenHash field. |
|**authorization / action** | The action that is assigned to the request. |
|**authorization / denyAssignmentId** | The date in GUID format when access was denied by a deny assignment. <br> The deny assignment might be from Azure Blueprints or a managed application. <br> For more information on deny assignments, see [Understand Azure deny assignments](../articles/role-based-access-control/deny-assignments.md) |
|**authorization / reason** | The reason for the authorization result of the request. <br> For example: `Policy`, `NoApplicablePolicy`, or `MissingAttributes` |
|**authorization / result** | The authorization result of the request. <br> For example: `Granted` or `Denied` |
|**authorization / roleAssignmentId** | The role assignment ID. <br> For example: `11bb11bb-cc22-dd33-ee44-55ff55ff55ff`.|
|**authorization / roleDefinitionId** | The role definition ID. <br> For example: `00aa00aa-bb11-cc22-dd33-44ee44ee44ee`.|
|**authorization / type** | The source of the authorization result for the request. <br> For example: `RBAC` or `ABAC` |
|**principals / id** | The ID of the security principal. <br> For example: `a4711f3a-254f-4cfb-8a2d-111111111111`.|
|**principals / type** | The type of security principal. <br> For example: `ServicePrincipal`. |
|**properties / metricResponseType** | The response from the metrics transaction. <br> For examples, see the ResponseType metrics dimension for your storage service: <br> [blobs](../articles/storage/blobs/monitor-blob-storage-reference.md#metrics-dimensions) <br> [files](../articles/storage/files/storage-files-monitoring-reference.md#metrics-dimensions) <br> [queues](../articles/storage/queues/monitor-queue-storage-reference.md#metrics-dimensions) <br> [tables](../articles/storage/tables/monitor-table-storage-reference.md#metrics-dimensions) |
|**properties / objectKey** | The path to the object being accessed. <br> For example: `samplestorageaccount/container1/blob.png`. |
|**requester / appID** | The Open Authorization (OAuth) application ID that is used as the requester. <br> For example: `00001111-aaaa-2222-bbbb-3333cccc4444`.|
|**requester / audience** | The OAuth audience of the request. <br> For example: `https://storage.azure.com`. |
|**requester / objectId** | The OAuth object ID of the requester. In case of Kerberos authentication, represents the object identifier of Kerberos authenticated user. <br> For example: `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`. |
|**requester / tenantId** | The OAuth tenant ID of identity. <br> For example: `aaaabbbb-0000-cccc-1111-dddd2222eeee`.|
|**requester / tokenIssuer** | The OAuth token issuer. <br> For example: `https://sts.windows.net/aaaabbbb-0000-cccc-1111-dddd2222eeee/`.|
|**requester / upn** | The User Principal Name (UPN) of requestor. <br> For example: `someone@contoso.com`. |
|**requester / userName** | This field is reserved for internal use only.|
|**requester / uniqueName** | The unique name of the requester. For example: `someone@example.com`. |
|**delegatedResource / tenantId**| The Microsoft Entra tenant ID of the Azure resource ID which accesses storage on-behalf-of the storage resource owner (for example: `aaaabbbb-0000-cccc-1111-dddd2222eeee`). |
|**delegatedResource / resourceId**|The Azure resource ID which accesses storage on behalf of the storage resource owner (for example: `/subscriptions/<sub>/resourcegroups/<rg>/providers/Microsoft.Compute/virtualMachines/<vm-name>`)|
|**delegatedResource / objectId**|The Microsoft Entra object ID of the Azure resource ID which accesses storage on behalf of the storage resource owner (for example: `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`).|

