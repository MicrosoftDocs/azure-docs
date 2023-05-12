# Enable and Disable Eureka Server in Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

Service registration and discovery are key requirements for maintaining a list of live app instances to call, and routing and load balancing inbound requests. Configuring each client manually takes time and introduces the possibility of human error. 

## Prerequisites

- Completion of the previous quickstart in this series: [Provision Standard Consumption Azure Spring Apps service](./quickstart-provision-standard-consumption-service-instance.md).

## Enable the Eureka Server
```azurecli
az spring eureka-server enable -n <service instance name>
```

## Disable the Eureka Server

```azurecli
az spring eureka-server disable -n <service instance name>
```

## Next steps

> [!div class="nextstepaction"]
> [Discover and register your Spring Boot applications in Azure Spring Apps](how-to-service-registration.md)
