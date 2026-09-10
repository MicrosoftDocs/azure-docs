---
title: Mirror Azure IoT Operations deployment images to a private registry
description: Use the Deployment Image List (DIL) to inventory, scan, and mirror Azure IoT Operations container images into a private registry, and redirect cluster image pulls away from public Microsoft registries.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 08/27/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator in a regulated or network-restricted environment, I want an authoritative list of the container images that a release uses, so that I can scan and mirror them into my own registry instead of pulling from public Microsoft registries.
---

# Mirror deployment images to a private registry

If your cluster exists in a regulated, network-restricted, or disconnected environment, the Microsoft Artifact Registry (mcr.microsoft.com) might not be reachable and deployment of Azure IoT Operations will fail. To deploy Azure IoT Operations in such environments, you can mirror deployment images to a private registry.

Starting with version 1.4.73 (2608), Azure IoT Operations publishes a *Deployment Image List* (DIL) with each release. The DIL is a machine-readable inventory of the container images that the release uses, where every image is identified by an immutable SHA-256 digest.

Use the DIL to:

- Inventory and scan the container images in a release before you deploy it, without needing cluster access.
- Mirror the image set into a private registry by immutable digest.
- Redirect cluster image pulls from Microsoft Container Registry (MCR) to your private mirror. The procedure in this article is validated for K3s.
- Enforce restricted egress without image pulls silently falling back to a public registry.

The list is derived from an actual deployment of the release, including images that are pulled only during uninstall. Before publication, it's validated by forcing all container image pulls through a private mirror.

> [!IMPORTANT]
> This article covers image inventory, image mirroring, and image-pull redirection. It isn't a complete procedure for a fresh installation on a disconnected cluster, which also requires installation packages and Helm charts to be reachable without public registry access.

## Prerequisites

- The Azure CLI and [jq](https://jqlang.github.io/jq/) installed on the machine that you run these steps from.
- A target registry. For Azure Container Registry, your signed-in identity needs the **Container Registry Data Importer and Data Reader** role to import images. For more information, see [Azure Container Registry Microsoft Entra permissions and role assignments overview](/azure/container-registry/container-registry-rbac-built-in-roles-overview).
- If the target registry is network-restricted, it must allow trusted services so that server-side import can reach it. For more information, see [Import container images to a container registry](/azure/container-registry/container-registry-import-images).
- A cluster that meets the requirements in [Supported environments](../deploy-iot-ops/overview-deploy.md#supported-environments).

## Get the deployment image list

The DIL is published in the [azure-iot-operations](https://github.com/Azure/azure-iot-operations) repository, in the `deployment-image-list` folder, and it's tagged with each release. Download the file for the exact Azure IoT Operations version that you deploy.

1. Identify the release tag for your version. Tags use the form `v<version>`, for example `v1.4.73`.

   To find the version of an existing instance, check the instance overview page in the Azure portal, or run [az iot ops show](/cli/azure/iot/ops#az-iot-ops-show). For the full list of releases, see [azure-iot-operations releases](https://github.com/Azure/azure-iot-operations/releases).

1. Download the DIL for that tag.

   ```bash
   VERSION=<your-version>
   curl -fsSLO https://raw.githubusercontent.com/Azure/azure-iot-operations/v$VERSION/deployment-image-list/aio-customer-dil-$VERSION.json
   ```

> [!IMPORTANT]
> Download from the release tag rather than from `main`, so that the list matches the release you deploy. Use only the customer DIL published in the repository. Files from development builds can reference staging dependencies that you can't access.

## Understand the file

The DIL has two top-level arrays:

```json
{
  "images": [ ... ],
  "helmCharts": [ ... ]
}
```

Use the `images` array for inventory, scanning, and mirroring. The `helmCharts` array is included for traceability and isn't used by this procedure.

### images

| Field | Description |
| --- | --- |
| `repo` | Full repository path, including the registry host. |
| `tag` | Image tag. |
| `digest` | Manifest SHA-256 digest. This value is the authoritative identity of the image. |
| `namespace` | Kubernetes namespace where the image runs. This value is empty for images that aren't bound to a namespace at steady state, such as run-once or diagnostic images. Account for empty values if you group or filter by namespace. |
| `multiArch` | `true` when the manifest is a multi-architecture index. |
| `architectures` | The Linux platforms that the manifest covers. |

Compose a fully qualified reference as `<repo>:<tag>@<digest>`.

### helmCharts

| Field | Description |
| --- | --- |
| `release` | Helm release name. |
| `chartName` | Chart name. |
| `chartVersion` | Chart version. |
| `appVersion` | Application version that the chart deploys. |
| `namespace` | Namespace that the release is installed into. |
| `ociRef` | OCI reference for the chart. Can be `null`. |
| `digest` | Chart digest. Can be `null`. |

> [!NOTE]
> `ociRef` and `digest` are `null` for charts that aren't distributed as OCI artifacts, so chart-level traceability is partial. You don't need to mirror charts for this procedure.

> [!NOTE]
> The same chart can be installed more than once under different release names. For example, the OpenTelemetry collector chart is installed twice, once for general observability and once for cluster metrics. Treat `release` as the unique key for an entry rather than `chartName`, so that a repeated chart name isn't mistaken for a duplicate entry.

### Scope

The DIL covers the container images that Azure IoT Operations and its foundational dependencies require for the validated release configuration, including Azure Arc agents, cert-manager, the secret store, and workload identity components.

The DIL doesn't inventory:

- Images supplied by your Kubernetes distribution or container network interface.
- Your own workloads.
- Independently installed add-ons.

Include those dependencies separately when you prepare a private registry.

## Scan and inventory the images

You don't need cluster access for this section.

1. Validate that every image entry has the fields required for digest-based mirroring.

   ```bash
   jq -e '
     (.images | type == "array") and
     (.helmCharts | type == "array") and
     all(.images[];
       (.repo   | type == "string" and length > 0) and
       (.tag    | type == "string" and length > 0) and
       (.digest | type == "string" and test("^sha256:[0-9a-f]{64}$")))
   ' aio-customer-dil-<version>.json
   ```

1. List every immutable image reference for a scanner.

   ```bash
   jq -r '.images[] | "\(.repo):\(.tag)@\(.digest)"' aio-customer-dil-<version>.json
   ```

   Because every entry carries a digest, you can tie a scan result to an immutable artifact rather than to a tag that might later be repointed.

## Mirror the images to a private registry

Copy each image by digest so that the mirrored artifact is bit-for-bit identical to the one Microsoft published, and then apply the original tag at the destination.

The mapping rule strips the registry host from `repo` and places the remainder under a prefix of your choosing:

```text
mcr.microsoft.com/<repository>:<tag>  ->  <your-registry>/<prefix>/<repository>:<tag>
```

1. Import a single image to confirm your access and mapping. With Azure Container Registry, the copy is server-side, so nothing is pulled to the machine that runs the command.

   ```azurecli
   az acr import \
     --name <your-registry> \
     --source mcr.microsoft.com/<repository>@sha256:<digest> \
     --image <prefix>/<repository>:<tag> \
     --force
   ```

1. Mirror the full list.

   ```bash
   ACR=<your-registry>
   PREFIX=aio-mirror/<version>
   DIL=aio-customer-dil-<version>.json

   set -euo pipefail
   while IFS=$'\t' read -r source target; do
     az acr import --name "$ACR" --source "$source" --image "$PREFIX/$target" --force
   done < <(
     jq -r '.images[]
       | [ (.repo + "@" + .digest),
           ((.repo | sub("^[^/]+/"; "")) + ":" + .tag) ]
       | @tsv' "$DIL"
   )
   ```

For multi-architecture images, the digest refers to the manifest index. Importing the index preserves every architecture it contains, and each node continues to select the build that matches it.

If you use a registry other than Azure Container Registry, use a copy tool that preserves the source digest and the multi-architecture manifest index. Copy by digest, not by tag.

## Serve the cluster from your registry only

The DIL and digest-based mirroring are platform independent. Redirecting image pulls isn't: the mechanism, and whether the runtime can be stopped from falling back to the original registry, depend on your Kubernetes distribution.

The steps in this section use K3s. For other distributions, apply the same two requirements using that distribution's registry configuration. On AKS and AKS Edge Essentials, use a [connected registry](/azure/container-registry/intro-connected-registry) or an in-cluster pull-through cache instead.

### Redirect image pulls

Your Kubernetes distribution determines the registry configuration schema, file locations, and restart procedure. For K3s, [Private registry configuration](https://docs.k3s.io/installation/private-registry) is the authoritative reference. Follow it for the full schema, including registry authentication and private certificate authorities.

Two requirements are specific to Azure IoT Operations.

1. Mirror `mcr.microsoft.com`, and rewrite to the prefix you mirrored into. In K3s, this configuration goes in `registries.yaml`.

   ```yaml
   mirrors:
     "mcr.microsoft.com":
       endpoint:
         - "https://<your-registry>.azurecr.io"
       rewrite:
         "^(.*)$": "aio-mirror/<version>/${1}"
   ```

   The rewrite prefix must exactly match the prefix from the previous section, or pulls resolve to repositories that don't exist.

1. Disable the implicit fallback to the original registry. In K3s, set this value in `config.yaml`.

   ```yaml
   disable-default-registry-endpoint: true
   ```

   By default, K3s tries the original registry as a final endpoint when all configured mirrors fail. A partial or misconfigured mirror then still appears to work, while pulls quietly reach `mcr.microsoft.com`.

> [!IMPORTANT]
> Confirm that your distribution supports disabling the fallback before you rely on it. Older K3s releases don't support `disable-default-registry-endpoint`, and without it the fallback stays active even though the rest of the configuration looks correct.

> [!WARNING]
> Every registry host that you list must have a mirror prefix that you actually populated. With the fallback disabled, there's no second chance: a rewrite rule that points at an empty prefix causes pulls to fail at runtime. Add entries only for hosts that appear in the `repo` values of the DIL you mirrored.

Use a pull-only credential that's suitable for unattended use, and rotate it according to your security policy. Don't use the Azure Container Registry admin account. For more information, see [Authenticate with Azure Container Registry](/azure/container-registry/container-registry-authentication).

Apply the configuration to every server and agent node that can run workloads. Use your normal configuration management and secret distribution controls rather than editing nodes by hand. Treat the registry configuration file as secret-bearing.

### Block egress

Disabling the fallback only affects the registries that you explicitly configured. Any other registry keeps its default behavior, so registry configuration alone isn't an egress boundary.

For an independent enforcement boundary, use your firewall, proxy, or egress-control system to deny direct access from cluster nodes to `mcr.microsoft.com`.

> [!NOTE]
> Microsoft Artifact Registry, also known as Microsoft Container Registry, is a single registry served from mcr.microsoft.com. One mirror entry and one egress rule cover every image in the DIL. If a future release references an additional registry host, add a matching mirror entry and mirror its images before you enforce egress.

> [!CAUTION]
> Don't rely on DNS or hosts-file changes as your only production security control.

### Verify the configuration

Validate this workflow on a non-production cluster before you apply it broadly.

1. Confirm that the public registry is unreachable from every node.

   ```bash
   curl -sS --max-time 10 https://mcr.microsoft.com/v2/ ; echo "exit=$?"
   ```

1. Remove an image locally, then pull it again. A pull from a warm cache proves nothing.

   ```bash
   DIL=aio-customer-dil-<version>.json

   IMAGE=$(jq -r '.images[0] | "\(.repo):\(.tag)"' "$DIL")
   sudo k3s crictl rmi "$IMAGE" || true
   sudo k3s crictl pull "$IMAGE"
   ```

1. After the pull succeeds, inspect the K3s containerd log on that node to confirm that the request used the private registry endpoint.

1. Exercise an installation or a workload restart in a test environment. Confirm that all Azure IoT Operations pods return to a healthy state while public registry egress remains blocked.

## Limitations

- Use the DIL that matches the exact Azure IoT Operations release. Re-mirror for every release rather than assuming that unchanged tags still identify unchanged content.
- The DIL reflects the configuration that was validated for the release. Optional features, add-ons, or workloads that the configuration doesn't exercise can require more dependencies.
- Azure Arc deploys the billing and diagnostics components as *system extensions*. System extensions aren't version-pinned to an Azure IoT Operations release, and Azure Arc installs the latest available version of each one when you deploy Azure IoT Operations. If a newer version is published after the DIL for your release, the deployed images don't match the digests in the DIL.
- Azure Arc agents and Arc-managed extensions upgrade independently. Ensure that their current dependencies remain available after Arc-side upgrades.
- Images that you supply through extension parameter overrides aren't included, because the release can't know what you replace them with.
- Platform images that your Kubernetes distribution supplies are outside the scope of the DIL.

> [!IMPORTANT]
> The system extension limitation affects deployment, not just later upgrades. On a cluster where public registry egress is blocked, an unmirrored system extension image can't be pulled, and deployment fails. The affected images are in the `mcr.microsoft.com/azurek8sbilling` and `mcr.microsoft.com/azuremonitor` repositories, which run in the `azure-extensions-usage-system` and `azure-arc` namespaces.
>
> Before you deploy to a cluster with restricted egress, deploy the same Azure IoT Operations version to a connected test cluster and compare the images it actually pulls against the DIL:
>
> ```bash
> kubectl get pods --all-namespaces \
>   -o jsonpath='{range .items[*]}{range .spec.containers[*]}{.image}{"\n"}{end}{end}' \
>   | sort -u
> ```
>
> Mirror any image that the cluster uses but the DIL doesn't list. Repeat this check for each deployment, because the system extension versions can change between deployments of the same Azure IoT Operations release.
>
> To keep those versions stable after deployment, [turn off autoupgrade for Azure Arc](/azure/azure-arc/kubernetes/agent-upgrade#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc). Turning off autoupgrade doesn't change which versions are installed during the initial deployment.

## Frequently asked questions

### Do I have to mirror the Helm charts as well?

No. This procedure uses only the entries in the `images` array.

### Can I mirror by tag instead of digest?

You can, but you lose the guarantee that what you mirrored is what Microsoft published. Digests are included so that this is verifiable.

### Can I mirror only a subset of the images?

Not safely. Images that appear only during uninstall, or only after a workload starts, look unnecessary until the moment they're needed. At that point the pull fails, with no route to the public registry.

### Does the digest change between releases even when the tag doesn't?

Treat the DIL for each release as authoritative, and re-mirror for each release rather than assuming that a tag still resolves to the same artifact.

## Related content

- [Validate images](./howto-validate-images.md)
- [Deployment overview](../deploy-iot-ops/overview-deploy.md)
- [Azure IoT Operations endpoints](../deploy-iot-ops/overview-deploy.md#azure-iot-operations-endpoints)
- [Production deployment guidelines](../deploy-iot-ops/concept-production-guidelines.md)
- [Import container images to a container registry](/azure/container-registry/container-registry-import-images)
- [Authenticate with Azure Container Registry](/azure/container-registry/container-registry-authentication)
- [K3s private registry configuration](https://docs.k3s.io/installation/private-registry)
