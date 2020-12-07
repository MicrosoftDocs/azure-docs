# Update Service Principal credentials

For scenarios where an Azure Arc data controller is deployed using a specific set of values for Service Principal Tenant Id, Client ID and Client Secret and when one or more of these values have changed the changes need to be reflected back into the data controller secrets as well. Following are the instructions to update Tenant Id, Client Id or the Client secret. 
```
kubectl edit secret/upload-service-principal-secret -n <name of namespace>
```
For example:
```
kubectl edit secret/upload-service-principal-secret -n arc
```

This should open the credentials yml file in the default editor. 

For instance:

```
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  authority: aHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29t
  clientId: NDNiNDcwYrFTGWYzOC00ODhkLTk0ZDYtNTc0MTdkN2YxM2Uw
  clientSecret: VFA2RH125XU2MF9+VVhXenZTZVdLdECXFlNKZi00Lm9NSw==
  tenantId: NzJmOTg4YmYtODZmMRFVBGTJLSATkxYWItMmQ3Y2QwMTFkYjQ3
kind: Secret
metadata:
  creationTimestamp: "2020-12-02T05:02:04Z"
  name: upload-service-principal-secret
  namespace: arc
  resourceVersion: "7235659"
  selfLink: /api/v1/namespaces/arc/secrets/upload-service-principal-secret
  uid: 7fb693ff-6caa-4a31-b83e-9bf22be4c112
type: Opaque

```
Edit the values for clientID, clientSecret and/or tenantID as appropriate. 

> [!NOTE]
>The values need to be base64 encoded. 
Do not edit any other properties.

If an incorrect value is provided for clientId, clientSecret or tenantID then you will see an error message as follows in the control-xxxx pod/controller container logs:

2020-12-02 05:16:10.8655 | ERROR | [AzureUpload] Upload task exception: A configuration issue is preventing authentication - check the error message from the server for details.You can modify the configuration in the application registration portal. See https://aka.ms/msal-net-invalid-client for details.  Original exception: AADSTS7000215: Invalid client secret is provided.




