With Azure Resource Manager, you define can parameters for 
the values to use when deploying the template. 
The template includes a `parameters` section 
that contains all the parameter values. 
Each parameter value is used by the template to 
define the resources that you want to deploy.

Do not define parameters for values that always stay the same. 
You should only define parameters for the values that vary based on the project 
that you are deploying or based on the environment where you are deploying.

When you define parameters:

* To specify the permitted values that a user can provide during deployment, 
use the **allowedValues** field.

* To assign default values to parameter when no values are provided during deployment, 
use the **defaultValue** field. 
