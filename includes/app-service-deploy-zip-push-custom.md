## Deployment customization

The deployment process assumes that the .zip file you push contains a ready-to-run app. By default, no customizations are run. You can enable the same build processes you get with continuous integration by adding the following to your application settings:

    SCM_DO_BUILD_DURING_DEPLOYMENT=true 

When using .zip push deployment, this setting is **false** by default. The default is **true** for continuous integration deployments. When set to **true**, your deployment-related settings are used during deployment. These settings can be set either as app settings or in a `.deployment` configuration file located in the root of your zip file. For more information, see [Repository and deployment-related settings](https://github.com/projectkudu/kudu/wiki/Configurable-settings#repository-and-deployment-related-settings) in the deployment reference.