# Enable resource providers

## Verify private preview access

In order to use Azure Arc for Kubernetes your Azure subscriptions need to have two feature flags enabled. Your private preview onboarding process included providing one or more Azure subscriptions to Microsoft engineering. Verify that the feature flags have been enabled for your subscription:

```console
az feature list -o table | grep Kubernetes
```

**Output:**

```console
Microsoft.Kubernetes/previewAccess                                                Registered
Microsoft.KubernetesConfiguration/sourceControlConfiguration                      Registered
```

If you receive an error, or do not see the following features in a `Registered` state, please check the following:

1. Ensure you are using the subscription that you provided to Microsoft: `az account set -s <subscription id>`
1. Re-check your feature flags

After verifying the subscription id, please reach out to your Microsoft contact to verify your subscriptions have been enabled for private preview access.

## Register Providers

Next, register the two providers for Azure Arc for Kubernetes:

```console
az provider register --namespace Microsoft.Kubernetes
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.Kubernetes'

az provider register --namespace Microsoft.KubernetesConfiguration
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.KubernetesConfiguration'
```

Registration is an asynchronous process. While registration should complete quickly (within 10 minutes). You may monitor registration process If you do not see registration state progress, reach out to <haikueng@microsoft.com>.

```console
az provider show -n Microsoft.Kubernetes -o table
```

**Output:**

```console
Namespace             RegistrationPolicy    RegistrationState
--------------------  --------------------  -------------------
Microsoft.Kubernetes  RegistrationRequired  Registered
```

```console
az provider show -n Microsoft.KubernetesConfiguration -o table
```

**Output:**

```console
Namespace                          RegistrationPolicy    RegistrationState
---------------------------------  --------------------  -------------------
Microsoft.KubernetesConfiguration  RegistrationRequired  Registered
```

## Next

* Return to the [README](../README.md#connect-your-first-cluster)
