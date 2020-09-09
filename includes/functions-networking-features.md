

| Feature |[Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan)|[Premium plan](../articles/azure-functions/functions-scale.md#premium-plan)|[Dedicated plan](../articles/azure-functions/functions-scale.md#app-service-plan)|[ASE](../articles/app-service/environment/intro.md)| [Kubernetes](../articles/azure-functions/functions-kubernetes-keda.md) |
|----------------|-----------|----------------|---------|-----------------------| ---|
|[Inbound IP restrictions and private site access](../articles/azure-functions/functions-networking-options.md#inbound-ip-restrictions)|✅Yes|✅Yes|✅Yes|✅Yes|✅Yes|
|[Virtual network integration](../articles/azure-functions/functions-networking-options.md#virtual-network-integration)|❌No|✅Yes (Regional)|✅Yes (Regional and Gateway)|✅Yes| ✅Yes|
|[Virtual network triggers (non-HTTP)](../articles/azure-functions/functions-networking-options.md#virtual-network-triggers-non-http)|❌No| ✅Yes |✅Yes|✅Yes|✅Yes|
|[Hybrid connections](../articles/azure-functions/functions-networking-options.md#hybrid-connections) (Windows only)|❌No|✅Yes|✅Yes|✅Yes|✅Yes|
|[Outbound IP restrictions](../articles/azure-functions/functions-networking-options.md#outbound-ip-restrictions)|❌No| ✅Yes|✅Yes|✅Yes|✅Yes|