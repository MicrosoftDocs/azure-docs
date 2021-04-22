---
title: Frequently asked questions
description: Answers for frequently asked questions related to the Azure Container Registry service 
author: sajayantony
ms.topic: article
ms.date: 03/15/2021
ms.author: sajaya
---

# Frequently asked questions about Azure Container Registry

This article addresses frequently asked questions and known issues about Azure Container Registry.

For registry troubleshooting guidance, see:
* [Troubleshoot registry login](container-registry-troubleshoot-login.md)
* [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md)
* [Troubleshoot registry performance](container-registry-troubleshoot-performance.md)

## Resource management

- [Can I create an Azure container registry using a Resource Manager template?](#can-i-create-an-azure-container-registry-using-a-resource-manager-template)
- [Is there security vulnerability scanning for images in ACR?](#is-there-security-vulnerability-scanning-for-images-in-acr)
- [How do I configure Kubernetes with Azure Container Registry?](#how-do-i-configure-kubernetes-with-azure-container-registry)
- [How do I get admin credentials for a container registry?](#how-do-i-get-admin-credentials-for-a-container-registry)
- [How do I get admin credentials in a Resource Manager template?](#how-do-i-get-admin-credentials-in-a-resource-manager-template)
- [Delete of replication fails with Forbidden status although the replication gets deleted using the Azure CLI or Azure PowerShell](#delete-of-replication-fails-with-forbidden-status-although-the-replication-gets-deleted-using-the-azure-cli-or-azure-powershell)
- [Firewall rules are updated successfully but they do not take effect](#firewall-rules-are-updated-successfully-but-they-do-not-take-effect)

### Can I create an Azure Container Registry using a Resource Manager template?

Yes. Here is [a template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-container-registry) that you can use to create a registry.

### Is there security vulnerability scanning for images in ACR?

Yes. See the documentation from [Azure Security Center](../security-center/defender-for-container-registries-introduction.md), [Twistlock](https://www.twistlock.com/2016/11/07/twistlock-supports-azure-container-registry/) and [Aqua](https://blog.aquasec.com/image-vulnerability-scanning-in-azure-container-registry).

### How do I configure Kubernetes with Azure Container Registry?

See the documentation for [Kubernetes](https://kubernetes.io/docs/user-guide/images/#using-azure-container-registry-acr) and steps for [Azure Kubernetes Service](../aks/cluster-container-registry-integration.md).

### How do I get admin credentials for a container registry?

> [!IMPORTANT]
> The admin user account is designed for a single user to access the registry, mainly for testing purposes. We do not recommend sharing the admin account credentials with multiple users. Individual identity is recommended for users and service principals for headless scenarios. See [Authentication overview](container-registry-authentication.md).

Before getting admin credentials, make sure the registry's admin user is enabled.

To get credentials using the Azure CLI:

```azurecli
az acr credential show -n myRegistry
```

Using Azure PowerShell:

```powershell
Invoke-AzureRmResourceAction -Action listCredentials -ResourceType Microsoft.ContainerRegistry/registries -ResourceGroupName myResourceGroup -ResourceName myRegistry
```

### How do I get admin credentials in a Resource Manager template?

> [!IMPORTANT]
> The admin user account is designed for a single user to access the registry, mainly for testing purposes. We do not recommend sharing the admin account credentials with multiple users. Individual identity is recommended for users and service principals for headless scenarios. See [Authentication overview](container-registry-authentication.md).

Before getting admin credentials, make sure the registry's admin user is enabled.

To get the first password:

```json
{
    "password": "[listCredentials(resourceId('Microsoft.ContainerRegistry/registries', 'myRegistry'), '2017-10-01').passwords[0].value]"
}
```

To get the second password:

```json
{
    "password": "[listCredentials(resourceId('Microsoft.ContainerRegistry/registries', 'myRegistry'), '2017-10-01').passwords[1].value]"
}
```

### Delete of replication fails with Forbidden status although the replication gets deleted using the Azure CLI or Azure PowerShell

The error is seen when the user has permissions on a registry but doesn't have Reader-level permissions on the subscription. To resolve this issue, assign Reader permissions on the subscription to the user:


```azurecli  
az role assignment create --role "Reader" --assignee user@contoso.com --scope /subscriptions/<subscription_id> 
```

### Firewall rules are updated successfully but they do not take effect

It takes some time to propagate firewall rule changes. After you change firewall settings, please wait for a few minutes before verifying this change.


## Registry operations

- [How do I access Docker Registry HTTP API V2?](#how-do-i-access-docker-registry-http-api-v2)
- [How do I delete all manifests that are not referenced by any tag in a repository?](#how-do-i-delete-all-manifests-that-are-not-referenced-by-any-tag-in-a-repository)
- [Why does the registry quota usage not reduce after deleting images?](#why-does-the-registry-quota-usage-not-reduce-after-deleting-images)
- [How do I validate storage quota changes?](#how-do-i-validate-storage-quota-changes)
- [How do I authenticate with my registry when running the CLI in a container?](#how-do-i-authenticate-with-my-registry-when-running-the-cli-in-a-container)
- [How to enable TLS 1.2?](#how-to-enable-tls-12)
- [Does Azure Container Registry support Content Trust?](#does-azure-container-registry-support-content-trust)
- [How do I grant access to pull or push images without permission to manage the registry resource?](#how-do-i-grant-access-to-pull-or-push-images-without-permission-to-manage-the-registry-resource)
- [How do I enable automatic image quarantine for a registry?](#how-do-i-enable-automatic-image-quarantine-for-a-registry)
- [How do I enable anonymous pull access?](#how-do-i-enable-anonymous-pull-access)
- [How do I push non-distributable layers to a registry?](#how-do-i-push-non-distributable-layers-to-a-registry)

### How do I access Docker Registry HTTP API V2?

ACR supports Docker Registry HTTP API V2. The APIs can be accessed at
`https://<your registry login server>/v2/`. Example: `https://mycontainerregistry.azurecr.io/v2/`

### How do I delete all manifests that are not referenced by any tag in a repository?

If you are on bash:

```azurecli
az acr repository show-manifests -n myRegistry --repository myRepository --query "[?tags[0]==null].digest" -o tsv  | xargs -I% az acr repository delete -n myRegistry -t myRepository@%
```

For PowerShell:

```azurecli
az acr repository show-manifests -n myRegistry --repository myRepository --query "[?tags[0]==null].digest" -o tsv | %{ az acr repository delete -n myRegistry -t myRepository@$_ }
```

Note: You can add `-y` in the delete command to skip confirmation.

For more information, see [Delete container images in Azure Container Registry](container-registry-delete.md).

### Why does the registry quota usage not reduce after deleting images?

This situation can happen if the underlying layers are still being referenced by other container images. If you delete an image with no references, the registry usage updates in a few minutes.

### How do I validate storage quota changes?

Create an image with a 1GB layer using the following docker file. This ensures that the image has a layer that is not shared by any other image in the registry.

```dockerfile
FROM alpine
RUN dd if=/dev/urandom of=1GB.bin  bs=32M  count=32
RUN ls -lh 1GB.bin
```

Build and push the image to your registry using the docker CLI.

```bash
docker build -t myregistry.azurecr.io/1gb:latest .
docker push myregistry.azurecr.io/1gb:latest
```

You should be able to see that the storage usage has increased in the Azure portal, or you can query usage using the CLI.

```azurecli
az acr show-usage -n myregistry
```

Delete the image using the Azure CLI or portal and check the updated usage in a few minutes.

```azurecli
az acr repository delete -n myregistry --image 1gb
```

### How do I authenticate with my registry when running the CLI in a container?

You need to run the Azure CLI container by mounting the Docker socket:

```bash
docker run -it -v /var/run/docker.sock:/var/run/docker.sock azuresdk/azure-cli-python:dev
```

In the container, install `docker`:

```bash
apk --update add docker
```

Then authenticate with your registry:

```azurecli
az acr login -n MyRegistry
```

### How to enable TLS 1.2?

Enable TLS 1.2 by using any recent docker client (version 18.03.0 and above). 

> [!IMPORTANT]
> Starting January 13, 2020, Azure Container Registry will require all secure connections from servers and applications to use TLS 1.2. Support for TLS 1.0 and 1.1 will be retired.

### Does Azure Container Registry support Content Trust?

Yes, you can use trusted images in Azure Container Registry, since the [Docker Notary](https://docs.docker.com/notary/getting_started/) has been integrated and can be enabled. For details, see [Content Trust in Azure Container Registry](container-registry-content-trust.md).


####  Where is the file for the thumbprint located?

Under `~/.docker/trust/tuf/myregistry.azurecr.io/myrepository/metadata`:

* Public keys and certificates of all roles (except delegation roles) are stored in the `root.json`.
* Public keys and certificates of the delegation role are stored in the JSON file of its parent role (for example `targets.json` for the `targets/releases` role).

It is suggested to verify those public keys and certificates after the overall TUF verification done by the Docker and Notary client.

### How do I grant access to pull or push images without permission to manage the registry resource?

ACR supports [custom roles](container-registry-roles.md) that provide different levels of permissions. Specifically, `AcrPull` and `AcrPush` roles allow users to pull and/or push images without the permission to manage the registry resource in Azure.

* Azure portal: Your registry -> Access Control (IAM) -> Add (Select `AcrPull` or `AcrPush` for the Role).
* Azure CLI: Find the resource ID of the registry by running the following command:

  ```azurecli
  az acr show -n myRegistry
  ```
  
  Then you can assign the `AcrPull` or `AcrPush` role to a user (the following example uses `AcrPull`):

  ```azurecli
  az role assignment create --scope resource_id --role AcrPull --assignee user@example.com
  ```

  Or, assign the role to a service principal identified by its application ID:

  ```azurecli
  az role assignment create --scope resource_id --role AcrPull --assignee 00000000-0000-0000-0000-000000000000
  ```

The assignee is then able to authenticate and access images in the registry.

* To authenticate to a registry:
    
  ```azurecli
  az acr login -n myRegistry 
  ```

* To list repositories:

  ```azurecli
  az acr repository list -n myRegistry
  ```

* To pull an image:

  ```bash
  docker pull myregistry.azurecr.io/hello-world
  ```

With the use of only the `AcrPull` or `AcrPush` role, the assignee doesn't have the permission to manage the registry resource in Azure. For example, `az acr list` or `az acr show -n myRegistry` won't show the registry.

### How do I enable automatic image quarantine for a registry?

Image quarantine is currently a preview feature of ACR. You can enable the quarantine mode of a registry so that only those images which have successfully passed security scan are visible to normal users. For details, see the [ACR GitHub repo](https://github.com/Azure/acr/tree/master/docs/preview/quarantine).

### How do I enable anonymous pull access?

Setting up an Azure container registry for anonymous (unauthenticated) pull access is currently a preview feature, available in the Standard and Premium [service tiers](container-registry-skus.md). 

To enable anonymous pull access, update a registry using the Azure CLI (version 2.21.0 or later) and pass the `--anonymous-pull-enabled` parameter to the [az acr update](/cli/azure/acr#az_acr_update) command:

```azurecli
az acr update --name myregistry --anonymous-pull-enabled
``` 

You may disable anonymous pull access at any time by setting `--anonymous-pull-enabled` to `false`.

> [!NOTE]
> * Before attempting an anonymous pull operation, run `docker logout` to ensure that you clear any existing Docker credentials.
> * Only data-plane operations are available to unauthenticated clients.
> * The registry may throttle a high rate of unauthenticated requests.
> * Currently, anonymous pull access isn't supported in [geo-replicated](container-registry-geo-replication.md) registry regions.

> [!WARNING]
> Anonymous pull access currently applies to all repositories in the registry. If you manage repository access using [repository-scoped tokens](container-registry-repository-scoped-permissions.md), be aware that all users may pull from those repositories in a registry enabled for anonymous pull. We recommend deleting tokens when anonymous pull access is enabled.

### How do I push non-distributable layers to a registry?

A non-distributable layer in a manifest contains a URL parameter that content may be fetched from. Some possible use cases for enabling non-distributable layer pushes are for network restricted registries, air-gapped registries with restricted access, or for registries with no internet connectivity.

For example, if you have NSG rules set up so that a VM can pull images only from your Azure container registry, Docker will pull failures for foreign/non-distributable layers. For example, a Windows Server Core image would contain foreign layer references to Azure container registry in its manifest and would fail to pull in this scenario.

To enable pushing of non-distributable layers:

1. Edit the `daemon.json` file, which is located in `/etc/docker/` on Linux hosts and at `C:\ProgramData\docker\config\daemon.json` on Windows Server. Assuming the file was previously empty, add the following contents:

   ```json
   {
     "allow-nondistributable-artifacts": ["myregistry.azurecr.io"]
   }
   ```
   > [!NOTE]
   > The value is an array of registry addresses, separated by commas.

2. Save and exit the file.

3. Restart Docker.

When you push images to the registries in the list, their non-distributable layers are pushed to the registry.

> [!WARNING]
> Non-distributable artifacts typically have restrictions on how and where they can be distributed and shared. Use this feature only to push artifacts to private registries. Ensure that you are in compliance with any terms that cover redistributing non-distributable artifacts.

## Diagnostics and health checks

- [Check health with `az acr check-health`](#check-health-with-az-acr-check-health)
- [docker pull fails with error: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)](#docker-pull-fails-with-error-nethttp-request-canceled-while-waiting-for-connection-clienttimeout-exceeded-while-awaiting-headers)
- [docker push succeeds but docker pull fails with error: unauthorized: authentication required](#docker-push-succeeds-but-docker-pull-fails-with-error-unauthorized-authentication-required)
- [`az acr login` succeeds, but docker commands fails with error: unauthorized: authentication required](#az-acr-login-succeeds-but-docker-fails-with-error-unauthorized-authentication-required)
- [Enable and get the debug logs of the docker daemon](#enable-and-get-the-debug-logs-of-the-docker-daemon)    
- [New user permissions may not be effective immediately after updating](#new-user-permissions-may-not-be-effective-immediately-after-updating)
- [Authentication information is not given in the correct format on direct REST API calls](#authentication-information-is-not-given-in-the-correct-format-on-direct-rest-api-calls)
- [Why does the Azure portal not list all my repositories or tags?](#why-does-the-azure-portal-not-list-all-my-repositories-or-tags)
- [Why does the Azure portal fail to fetch repositories or tags?](#why-does-the-azure-portal-fail-to-fetch-repositories-or-tags)
- [Why does my pull or push request fail with disallowed operation?](#why-does-my-pull-or-push-request-fail-with-disallowed-operation)
- [Repository format is invalid or unsupported](#repository-format-is-invalid-or-unsupported)
- [How do I collect http traces on Windows?](#how-do-i-collect-http-traces-on-windows)

### Check health with `az acr check-health`

To troubleshoot common environment and registry issues, see [Check the health of an Azure container registry](container-registry-check-health.md).

### docker pull fails with error: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)

 - If this error is a transient issue, then retry will succeed.
 - If `docker pull` fails continuously, then there could be a problem with the Docker daemon. The problem can generally be mitigated by restarting the Docker daemon. 
 - If you continue to see this issue after restarting Docker daemon, then the problem could be some network connectivity issues with the machine. To check if general network on the machine is healthy, run the following command to test endpoint connectivity. The minimum `az acr` version that contains this connectivity check command is 2.2.9. Upgrade your Azure CLI if you are using an older version.
 
  ```azurecli
  az acr check-health -n myRegistry
  ```

 - You should always have a retry mechanism on all Docker client operations.

### Docker pull is slow
Use [this](http://www.azurespeed.com/Azure/Download) tool to test your machine network download speed. If machine network is slow, consider using Azure VM in the same region as your registry. This usually gives you faster network speed.

### Docker push is slow
Use [this](http://www.azurespeed.com/Azure/Upload) tool to test your machine network upload speed. If machine network is slow, consider using Azure VM in the same region as your registry. This usually gives you faster network speed.

### Docker push succeeds but docker pull fails with error: unauthorized: authentication required

This error can happen with the Red Hat version of the Docker daemon, where `--signature-verification` is enabled by default. You can check the Docker daemon options for Red Hat Enterprise Linux (RHEL) or Fedora by running the following command:

```bash
grep OPTIONS /etc/sysconfig/docker
```

For instance, Fedora 28 Server has the following docker daemon options:

`OPTIONS='--selinux-enabled --log-driver=journald --live-restore'`

With `--signature-verification=false` missing, `docker pull` fails with an error similar to:

```output
Trying to pull repository myregistry.azurecr.io/myimage ...
unauthorized: authentication required
```

To resolve the error:
1. Add the option `--signature-verification=false` to the Docker daemon configuration file `/etc/sysconfig/docker`. For example:
   
   `OPTIONS='--selinux-enabled --log-driver=journald --live-restore --signature-verification=false'`
   
2. Restart the Docker daemon service by running the following command:
   
   ```bash
   sudo systemctl restart docker.service
   ```

Details of `--signature-verification` can be found by running `man dockerd`.

### az acr login succeeds but docker fails with error: unauthorized: authentication required

Make sure you use an all lowercase server URL, for example, `docker push myregistry.azurecr.io/myimage:latest`, even if the registry resource name is uppercase or mixed case, like `myRegistry`.

### Enable and get the debug logs of the Docker daemon    

Start `dockerd` with the `debug` option. First, create the Docker daemon configuration file (`/etc/docker/daemon.json`) if it doesn't exist, and add the `debug` option:

```json
{    
    "debug": true    
}
```

Then, restart the daemon. For example, with Ubuntu 14.04:

```bash
sudo service docker restart
```

Details can be found in the [Docker documentation](https://docs.docker.com/engine/admin/#enable-debugging).    

 * The logs may be generated at different locations, depending on your system. For example, for Ubuntu 14.04, it's `/var/log/upstart/docker.log`.    
See [Docker documentation](https://docs.docker.com/engine/admin/#read-the-logs) for details.    

 * For Docker for Windows, the logs are generated under %LOCALAPPDATA%/docker/. However it may not contain all the debug information yet.    

   In order to access the full daemon log, you may need some extra steps:

    ```console
    docker run --privileged -it --rm -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker:/usr/local/bin/docker alpine sh

    docker run --net=host --ipc=host --uts=host --pid=host -it --security-opt=seccomp=unconfined --privileged --rm -v /:/host alpine /bin/sh
    chroot /host
    ```
    Now you have access to all the files of the VM running `dockerd`. The log is at `/var/log/docker.log`.

### New user permissions may not be effective immediately after updating

When you grant new permissions (new roles) to a service principal, the change might not take effect immediately. There are two possible reasons:

* Azure Active Directory role assignment delay. Normally it's fast, but it could take minutes due to propagation delay.
* Permission delay on ACR token server. This could take up to 10 minutes. To mitigate, you can `docker logout` and then authenticate again with the same user after 1 minute:

  ```bash
  docker logout myregistry.azurecr.io
  docker login myregistry.azurecr.io
  ```

Currently ACR doesn't support home replication deletion by the users. The workaround is to include the home replication create in the template but skip its creation by adding `"condition": false` as shown below:

```json
{
    "name": "[concat(parameters('acrName'), '/', parameters('location'))]",
    "condition": false,
    "type": "Microsoft.ContainerRegistry/registries/replications",
    "apiVersion": "2017-10-01",
    "location": "[parameters('location')]",
    "properties": {},
    "dependsOn": [
        "[concat('Microsoft.ContainerRegistry/registries/', parameters('acrName'))]"
     ]
},
```

### Authentication information is not given in the correct format on direct REST API calls

You may encounter an `InvalidAuthenticationInfo` error, especially using the `curl` tool with the option `-L`, `--location` (to follow redirects).
For example, fetching the blob using `curl` with `-L` option and basic authentication:

```bash
curl -L -H "Authorization: basic $credential" https://$registry.azurecr.io/v2/$repository/blobs/$digest
```

may result in the following response:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Error><Code>InvalidAuthenticationInfo</Code><Message>Authentication information is not given in the correct format. Check the value of Authorization header.
RequestId:00000000-0000-0000-0000-000000000000
Time:2019-01-01T00:00:00.0000000Z</Message></Error>
```

The root cause is that some `curl` implementations follow redirects with headers from the original request.

To resolve the problem, you need to follow redirects manually without the headers. Print the response headers with the `-D -` option of `curl` and then extract: the `Location` header:

```bash
redirect_url=$(curl -s -D - -H "Authorization: basic $credential" https://$registry.azurecr.io/v2/$repository/blobs/$digest | grep "^Location: " | cut -d " " -f2 | tr -d '\r')
curl $redirect_url
```

### Why does the Azure portal not list all my repositories or tags? 

If you are using the Microsoft Edge/IE browser, you can see at most 100 repositories or tags. If your registry has more than 100 repositories or tags, we recommend that you use either the Firefox or Chrome browser to list them all.

### Why does the Azure portal fail to fetch repositories or tags?

The browser might not be able to send the request for fetching repositories or tags to the server. There could be various reasons such as:

* Lack of network connectivity
* Firewall
* Ad blockers
* DNS errors

Please contact your network administrator or check your network configuration and connectivity. Try running `az acr check-health -n yourRegistry` using your Azure CLI to check if your environment is able to connect to the Container Registry. In addition, you could also try an incognito or private session in your browser to avoid any stale browser cache or cookies.

### Why does my pull or push request fail with disallowed operation?

Here are some scenarios where operations may be disallowed:
* Classic registries are no longer supported. Please upgrade to a supported [service tier](./container-registry-skus.md) using [az acr update](/cli/azure/acr#az_acr_update) or the Azure portal.
* The image or repository maybe locked so that it can't be deleted or updated. You can use the [az acr show repository](./container-registry-image-lock.md) command to view current attributes.
* Some operations are disallowed if the image is in quarantine. Learn more about [quarantine](https://github.com/Azure/acr/tree/master/docs/preview/quarantine).
* Your registry may have reached its [storage limit](container-registry-skus.md#service-tier-features-and-limits).

### Repository format is invalid or unsupported

If you see an error such as "unsupported repository format", "invalid format", or "the requested data does not exist" when specifying a repository name in repository operations, check the spelling and case of the name. Valid repository names can only include lowercase alphanumeric characters, periods, dashes, underscores, and forward slashes. 

For complete repository naming rules, see the [Open Container Initiative Distribution Specification](https://github.com/docker/distribution/blob/master/docs/spec/api.md#overview).

### How do I collect http traces on Windows?

#### Prerequisites

- Enable decrypting https in fiddler:  <https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/DecryptHTTPS>
- Enable Docker to use a proxy through the Docker ui: <https://docs.docker.com/docker-for-windows/#proxies>
- Be sure to revert when complete.  Docker won't work with this enabled and fiddler not running.

#### Windows containers

Configure Docker proxy to 127.0.0.1:8888

#### Linux containers

Find the ip of the Docker vm virtual switch:

```powershell
(Get-NetIPAddress -InterfaceAlias "*Docker*" -AddressFamily IPv4).IPAddress
```

Configure the Docker proxy to output of the previous command and the port 8888 (for example 10.0.75.1:8888)

## Tasks

- [How do I batch cancel runs?](#how-do-i-batch-cancel-runs)
- [How do I include the .git folder in az acr build command?](#how-do-i-include-the-git-folder-in-az-acr-build-command)
- [Does Tasks support GitLab for Source triggers?](#does-tasks-support-gitlab-for-source-triggers)
- [What git repository management service does Tasks support?](#what-git-repository-management-service-does-tasks-support)

### How do I batch cancel runs?

The following commands cancel all running tasks in the specified registry.

```azurecli
az acr task list-runs -r $myregistry --run-status Running --query '[].runId' -o tsv \
| xargs -I% az acr task cancel-run -r $myregistry --run-id %
```

### How do I include the .git folder in az acr build command?

If you pass a local source folder to the `az acr build` command, the `.git` folder is excluded from the uploaded package by default. You can create a `.dockerignore` file with the following setting. It tells the command to restore all files under `.git` in the uploaded package. 

`!.git/**`

This setting also applies to the `az acr run` command.

### Does Tasks support GitLab for Source triggers?

We currently do not support GitLab for Source triggers.

### What git repository management service does Tasks support?

| Git service | Source context | Manual build | Auto build through commit trigger |
|---|---|---|---|
| GitHub | `https://github.com/user/myapp-repo.git#mybranch:myfolder` | Yes | Yes |
| Azure Repos | `https://dev.azure.com/user/myproject/_git/myapp-repo#mybranch:myfolder` | Yes | Yes |
| GitLab | `https://gitlab.com/user/myapp-repo.git#mybranch:myfolder` | Yes | No |
| BitBucket | `https://user@bitbucket.org/user/mayapp-repo.git#mybranch:myfolder` | Yes | No |

## Run Error Message Troubleshooting

| Error message | Troubleshooting guide |
|---|---|
|No access was configured for the VM, hence no subscriptions were found|This could happen if you are using `az login --identity` in your ACR Task. This is a transient error and occurs when the role assignment of your Managed Identity hasn't propagated. Waiting a few seconds before retrying works.|

## CI/CD integration

- [CircleCI](https://github.com/Azure/acr/blob/master/docs/integration/CircleCI.md)
- [GitHub Actions](https://github.com/Azure/acr/blob/master/docs/integration/github-actions/github-actions.md)

## Next steps

* [Learn more](container-registry-intro.md) about Azure Container Registry.
