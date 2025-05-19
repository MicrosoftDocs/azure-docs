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

