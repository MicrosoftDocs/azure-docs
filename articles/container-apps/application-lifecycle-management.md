---
title: Application lifecycle management in Azure Container Apps
description: Learn about the full application lifecycle in Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Application lifecycle management in Azure Container Apps

<!-- PRELIMINARY OUTLINE

What happens when I deploy an app?
    your first revision is automatically created, and app is running
    if you enable ingress, then you get an IP and port, with a FQDN assignment

What happens as it scales?
    use conceptual diagram
    if you have scale rules set up, then scale rules
    abstracted away from you, based on scale rules
    KEDA handles the scaling for you 
        automatically setup and managed for you by Container Apps
        how long does it take to scale in/out <- link to scale-app.md
    If ingress, them proxy handles load balancing across replicas

Graceful shutdowns
    send a "sigterm" to your container
        Timeout for responding to sigterm
            TODO: how long is the duration?
            send a "sigkill" if you don't respond to sigterm
    your code needs to handle it
    .NET core IHost model as an example
    happens any time you container shuts down
        scale in operations
        app is stopped: deleting, deactivating a revision

If your container crashes, then it is automatically restarted
    
    
    

How do I make changes?
- application scope changes: changing app, but not a new revision
    - managing secrets
    - managing traffic (% splitting)
    - ingress settings: toggling ingress on/off
    - registries section: credentials for private containers repositories for Docker Hub or ACR
- revision scope
    - container changes / code changes
    - scale rules
    - dapr settings

intro to revisions
    the way container apps help you manage your application lifecycle, is by automatically generating new revisions to your app when ever a change is made

    which allows you to control which revisions are active and how traffic is split between them if you have ingress enabled

why more than 1 revision?
    advanced upgrade strategies
    for http apps
        A/B testing
        blue/green deployments
            split traffic between them
    less useful for non-http, but can be used for building block for upgrading strategies
        

What happens when something goes wrong?
- deployment
    - container failed to start - bug somewhere
- scale
    - scale settings are misconfigured - too aggressively or not aggressive enough
        - do your due diligence - load testing, etc.
- upgrades
    - new revision is broken, what do you do?
        - tools - shift traffic, activate/deactivate through revisions

activationMode: multiple | single

Deleting an application
    ARM template
    CLI
        az containerapp delete -n myapp -g myRG
    send a sigterm - then shut down

-->

You have multiple revisions for:
 [A/B testing](https://wikipedia.org/wiki/A/B_testing)
 [Blue Green deployment scenarios](https://martinfowler.com/bliki/BlueGreenDeployment.html)


diagram with on revision
diagram with ingress
 balancing

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
