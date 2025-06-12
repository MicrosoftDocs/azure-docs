---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/08/2025
ms.author: cephalin
---

### How do sidecar containers handle internal communication?

Sidecar containers share the same network host as the main container, so the main container (and other sidecar containers) can reach any port on the sidecar with `localhost:<port>`. The example *startup.sh* uses `localhost:4318` to access port 4318 on the **otel-collector** sidecar.

In the **Edit container** dialog, the **Port** box isn't currently used by App Service. You can use it as part of the sidecar metadata, such as to indicate which port the sidecar is listening to.

### Can a sidecar container receive internet requests?

No. App Service routes internet requests only to the main container. For code-based Linux apps, the built-in Linux container is the main container, and any sidecar container ([sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers)) should be added with `IsMain=false`. For custom containers, all but one of the [sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers) should have `IsMain=false`.

For more information on configuring `IsMain`, see [Microsoft.Web sites/sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers).

### How do I use volume mounts?

The Volume mounts feature enables you to share non-persistent files and directories between containers within your Web App.

:::image type="content" source="../../media/tutorial-custom-container-sidecar/configure-volume-mounts.png" alt-text="Screenshot showing a volume mount configuration for a sidecar container.":::

**Volume sub path:** This is a logical directory path that is automatically created, and is not referenced within the container. Containers that are configured with the same volume sub path can share files and directories with each other.

**Container mount path:** This corresponds to a directory path that you reference within the container. The container mount path is mapped to the volume sub path.

For example, suppose the following volume mounts are configured:

| Sidecar name | Volume sub path | Container mount path | Read-only |
| ------------ | --------------- | -------------------- | --------- |
| Container1 | /directory1/directory2 | /container1Vol | False |
| Container2 | /directory1/directory2 | /container2Vol | True |
| Container3 | /directory1/directory2/directory3 | /container3Vol | False |
| Container4 | /directory4 | /container1Vol | False |

Based on these settings, the following conditions apply:
-	If Container1 creates **/container1Vol/myfile.txt**, Container2 can read the file via **/container2Vol/myfile.txt**.
-	If Container1 creates **/container1Vol/directory3/myfile.txt**, Container2 can read the file via **/container2Vol/directory3/myfile.txt**, and Container3 can read and write to the file via **/container3Vol/myfile.txt**.
-	Container4 does not share a volume mount in common with any of the other containers.

> [!Note]
> For code-based Linux apps, the built-in Linux container cannot use volume mounts.
