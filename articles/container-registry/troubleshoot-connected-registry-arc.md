---
title: "Known issues: Connected Registry Arc Extension"
description: "Learn how to troubleshoot the most common problems for a Connected Registry Arc Extension and resolve issues with ease."
author: tejaswikolli-web
ms.author: gaking
ms.service: azure-container-registry
ms.topic: troubleshooting-known-issue #Don't change.
ms.date: 05/09/2024
#customer intent: As a customer, I want to understand the common issues with the connected registry Arc extension and how to troubleshoot them.
---

# Troubleshoot connected registry extension 

This article discusses some common error messages that you may receive when you install or update the connected registry extension for Arc-enabled Kubernetes clusters. 

## How is the connected registry extension installed 

The connected registry extension is released as a helm chart and installed by Helm V3. All components of the connected registry extension are installed in _connected-registry_ namespace. You can use the following commands to check the extension status. 

```bash
# get the extension status 
az k8s-extension show --name <extension-name>  
# check status of all pods of connected registry extension 
kubectl get pod -n connected-registry    
# get events of the extension 
kubectl get events -n connected-registry   --sort-by='.lastTimestamp'
```

## Common errors 

### Error: can't reuse a name that is still in use 

This error means the extension name you specified already exists. If the name is already in use, you need to use another name.   

### Error: unable to create new content in namespace _connected-registry_ because it's being terminated 

This error happens when an uninstallation operation isn't finished, and another installation operation is triggered. You can run `az k8s-extension show` command to check the provisioning status of the extension and make sure the extension has been uninstalled before taking other actions. 

### Error: failed in download the Chart path not found 

This error happens when you specify the wrong extension version. You need to make sure the specified version exists. If you want to use the latest version, you don't need to specify `--version`. 

## Common Scenarios 

### Scenario 1: Installation fails but doesn't show an error message 

If the extension generates an error message when you create or update it, you can inspect where the creation failed by running the `az k8s-extension list` command: 

```bash
az k8s-extension list \ 
--resource-group <my-resource-group-name> \ 
--cluster-name <my-cluster-name> \ 
--cluster-type connectedClusters
```
 
**Solution:** Restart the cluster, register the service provider, or delete and reinstall connected registry 

To fix this issue, try the following methods: 

- Restart your Arc Kubernetes cluster. 

- Register the KubernetesConfiguration service provider. 

- Force delete and reinstall the connected registry extension. 

### Scenario 2: Targeted connected registry version doesn't exist 

When you try to install the connected registry extension to target a specific version, you receive an error message that states that the connected registry version doesn't exist. 

**Solution:** Install again for a supported connected registry version 

Try again to install the extension. Make sure that you use a supported version of connected registry. 

## Common issues 

### Issue: Extension creation stuck in running state

**Possibility 1:** Issue with Persistent Volume Claim (PVC) 

- Check status of connected registry PVC 
```bash
kubectl get pvc -n connected-registry -o yaml connected-registry-pvc
``` 

The value of _phase_ under _status_ should be _bound_. If it doesn’t change from _pending_, delete the extension. 

- Check whether the desired storage class is in your list of storage classes: 

```bash
kubectl get storageclass --all-namespaces
``` 

- If not, recreate the extension and add
   
```bash
--config pvc.storageClassName=”standard”` 
``` 

- Alternatively, it could be an issue with not having enough space for the PVC. Recreate the extension with the parameter  

```bash
--config pvc.storageRequest=”250Gi”` 
``` 

**Possibility 2:** Connection String is bad 

- Check the logs for the connected registry Pod: 

```bash
kubectl get pod -n connected-registry
``` 

- Copy the name of the connected registry pod (e.g.: “connected-registry-8d886cf7f-w4prp") and paste it into the following command: 

```bash
kubectl logs -n connected-registry connected-registry-8d886cf7f-w4prp
```  

- If you see the following error message, the connected registry's connection string is bad: 

```bash
Response: '{"errors":[{"code":"UNAUTHORIZED","message":"Incorrect Password","detail":"Please visit https://aka.ms/acr#UNAUTHORIZED for more information."}]}' 
``` 

- Ensure that a _protected-settings-extension.json_ file has been created 

```bash
cat protected-settings-extension.json
``` 

- If needed, regenerate _protected-settings-extension.json_ 

```bash
cat << EOF > protected-settings-extension.json  
{ 
"connectionString": "$(az acr connected-registry get-settings \ 
--name myconnectedregistry \ 
--registry myacrregistry \ 
--parent-protocol https \ 
--generate-password 1 \ 
--query ACR_REGISTRY_CONNECTION_STRING --output tsv --yes)" 
} 
EOF
``` 

- Update the extension to include the new connection string 

```bash
az k8s-extension update \ 
--cluster-name <myarck8scluster> \ 
--cluster-type connectedClusters \ 
--name <myconnectedregistry> \ 
-g <myresourcegroup> \ 
--config-protected-file protected-settings-extension.json
```

### Issue: Extension created, but connected registry is not an 'Online' state 

**Possibility 1:** Previous connected registry has not been deactivated 

This scenario commonly happens when a previous connected registry extension has been deleted and a new one has been created for the same connected registry. 

- Check the logs for the connected registry Pod: 

```bash
kubectl get pod -n connected-registry
```

- Copy the name of the connected registry pod (e.g.: “connected-registry-xxxxxxxxx-xxxxx") and paste it into the following command: 

```bash
kubectl logs -n connected-registry connected-registry-xxxxxxxxx-xxxxx
```

- If you see the following error message, the connected registry needs to be deactivated:  

`Response: '{"errors":[{"code":"ALREADY_ACTIVATED","message":"Failed to activate the connected registry as it is already activated by another instance. Only one instance is supported at any time.","detail":"Please visit https://aka.ms/acr#ALREADY_ACTIVATED for more information."}]}'` 

- Run the following command to deactivate:  

```azurecli
az acr connected-registry deactivate -n <myconnectedregistry> -r <mycontainerregistry>
```

After a few minutes, the connected registry pod should be recreated, and the error should disappear. 
 
## Enable logging

- Run the [az acr connected-registry update] command to update the connected registry extension with the debug log level:

```azurecli
az acr connected-registry update --registry mycloudregistry --name myacrregistry --log-level debug
```

- The following log levels can be applied to aid in troubleshooting:

  - **Debug** provides detailed information for debugging purposes.

  - **Information** provides general information for debugging purposes.

  - **Warning** indicates potential problems that aren't yet errors but might become one if no action is taken.

  - **Error** logs errors that prevent an operation from completing.

  - **None** turns off logging, so no log messages are written.

- Adjust the log level as needed to troubleshoot the issue.

The active selection provides more options to adjust the verbosity of logs when debugging issues with a connected registry. The following options are available:

The connected registry log level is specific to the connected registry's operations and determines the severity of messages that the connected registry handles. This setting is used to manage the logging behavior of the connected registry itself.

**--log-level** set the log level on the instance. The log level determines the severity of messages that the logger handle. By setting the log level, you can filter out messages that are below a certain severity. For example, if you set the log level to "warning" the logger handles warnings, errors, and critical messages, but it ignores information and debug messages.

The az cli log level controls the verbosity of the output messages during the operation of the Azure CLI. The Azure CLI (az) provides several verbosity options for log levels, which can be adjusted to control the amount of output information during its operation:

**--verbose** increases the verbosity of the logs. It provides more detailed information than the default setting, which can be useful for identifying issues.

**--debug** enables full debug logs. Debug logs provide the most detailed information, including all the information provided at the "verbose" level plus more details intended for diagnosing problems.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploying the Connected Registry Arc Extension](quickstart-connected-registry-arc-cli.md)
> [Glossary of terms](connected-registry-glossary.md)