
```
Message: Microsoft.ExtendedLocation resource provider does not have the required permissions to create a namespace on the cluster.
```

This error is commonly caused by either not enabling the required azure-arc custom locations feature, or enabling the custom locations feature with an incorrect custom locations RP OID. To resolve, follow [this guidance](/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster) for enabling the custom locations feature with the correct OID.