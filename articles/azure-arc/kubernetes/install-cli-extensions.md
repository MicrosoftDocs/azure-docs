# CLI extensions

Azure Arc for Kubernetes consists of two CLI extensions, one to register and unregister a Kubernetes cluster, and a second extension to apply, update, and remove configurations.

During the private preview the extensions are made available through this preview repository. During public preview the extensions will be published to the usual Azure CLI extensions repository.

## Installing extensions

Required extension versions:

* **`connectedk8s`**: 0.1.0
* **`k8sconfiguration`**: 0.1.1

The latest extensions are included in the [extensions](../extensions) directory in this repository. If you have previously installed the extensions and are not up to date, please follow the instructions to [update the extension](#update-extensions).

First, install the `connectedk8s` extension, which helps you connect Kubernetes clusters to Azure:

```console
az extension add --source ./extensions/connectedk8s-0.1.0-py2.py3-none-any.whl --yes
```

Next, install the `k8sconfiguration` extension:

```console
az extension add --source ./extensions/k8sconfiguration-0.1.1-py2.py3-none-any.whl --yes
```

If you experience any issues installing, please file an issue in this repository.

## Check the installed extensions

Ensure that the extensions are at the current recommended versions

```console
az extension list -o table
```

**Output:**

```console
ExtensionType    Name                     Version
---------------  -----------------------  ---------
whl              connectedk8s             0.1.0
whl              k8sconfiguration         0.1.1
```

## Update extensions

Updating extensions requires you to remove and re-add the latest version.

```console
az extension remove --name connectedk8s
az extension remove --name k8sconfiguration
```

```console
az extension add --source ./extensions/connectedk8s-0.1.0-py2.py3-none-any.whl --yes
az extension add --source ./extensions/k8sconfiguration-0.1.1-py2.py3-none-any.whl --yes
```

## Next

* Return to the [README](../README.md)
* [Connect your first cluster](./02-connect-a-cluster.md)
