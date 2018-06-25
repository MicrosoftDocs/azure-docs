> [!IMPORTANT]
> Azure Firewall is currently a managed public preview that you need to explicitly enable using the `Register-AzureRmProviderFeature` PowerShell command as shown below:
>
>- `Register-AzureRmProviderFeature -FeatureName AllowRegionalGatewayManagerForSecureGateway -ProviderNamespace Microsoft.Network`
> - `Register-AzureRmProviderFeature -FeatureName AllowAzureFirewall -ProviderNamespace Microsoft.Network`
>
>It takes up to 30 minutes for feature registration to complete. You can check your registration status by running:
>
> - `Get-AzureRmProviderFeature -FeatureName AllowRegionalGatewayManagerForSecureGateway -ProviderNamespace Microsoft.Network`
> - `Get-AzureRmProviderFeature -FeatureName AllowAzureFirewall -ProviderNamespace Microsoft.Network`
>
>The examples in the Azure Firewall articles assume that you have already installed the public preview.
>
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.