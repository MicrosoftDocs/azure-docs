

|Name    |                         Current Value| Limit | Unit  | 
|--------|--------------------------------------|-------|-------|
|Availability Sets                            0 |  2000 | Count | 
|Total Regional vCPUs                         4 |   260 | Count | 
|Virtual Machines                             4 | 10000 | Count | 
|Virtual Machine Scale Sets                   1 |  2000 | Count | 
|Standard B Family vCPUs                      1 |    10 | Count | 
|Standard DSv2 Family vCPUs                   1 |   100 | Count | 
|Standard Dv2 Family vCPUs                    2 |   100 | Count | 
|Basic A Family vCPUs                         0 |   100 | Count | 
|Standard A0-A7 Family vCPUs                  0 |   250 | Count | 
|Standard A8-A11 Family vCPUs                 0 |   100 | Count | 
|Standard D Family vCPUs                      0 |   100 | Count | 
|Standard G Family vCPUs                      0 |   100 | Count | 
|Standard DS Family vCPUs                     0 |   100 | Count | 
|Standard GS Family vCPUs                     0 |   100 | Count | 
|Standard F Family vCPUs                      0 |   100 | Count | 
|Standard FS Family vCPUs                     0 |   100 | Count | 
|Standard NV Family vCPUs                     0 |    24 | Count | 
|Standard NC Family vCPUs                     0 |    48 | Count | 
|Standard H Family vCPUs                      0 |     8 | Count | 
|Standard Av2 Family vCPUs                    0 |   100 | Count | 
|Standard LS Family vCPUs                     0 |   100 | Count | 
|Standard Dv2 Promo Family vCPUs              0 |   100 | Count | 
|Standard DSv2 Promo Family vCPUs             0 |   100 | Count | 
|Standard MS Family vCPUs                     0 |     0 | Count | 
|Standard Dv3 Family vCPUs                    0 |   100 | Count | 
|Standard DSv3 Family vCPUs                   0 |   100 | Count | 
|Standard Ev3 Family vCPUs                    0 |   100 | Count | 
|Standard ESv3 Family vCPUs                   0 |   100 | Count | 
|Standard FSv2 Family vCPUs                   0 |   100 | Count | 
|Standard ND Family vCPUs                     0 |     0 | Count | 
|Standard NCv2 Family vCPUs                   0 |     0 | Count | 
|Standard NCv3 Family vCPUs                   0 |     0 | Count | 
|Standard LSv2 Family vCPUs                   0 |     0 | Count | 
|Standard Storage Managed Disks               2 | 10000 | Count | 
|Premium Storage Managed Disks                1 | 10000 | Count | 



## Reserved VM Instances
Reserved VM Instances which are scope to a single subscription will add a new aspect to the vCPU quotas. This new addition is <VM Size> Reserved Instances. These values describe the number of instances of the stated size that must be deployable in the subscription. They work as a placeholder in the quota system to ensure that quota is reserved to ensure reserved instances are deployable in the subscription. For example, if a specific subscription has 10 Standard_D1 reserved instances the usages limit for Standard_D1 Reserved Instances will be 10. This will cause Azure to ensure that there are always at least 10 vCPUs available in the Total Regional vCPUs quota to be used for Standard_D1 instances and there are at least 10 vCPUs available in the Standard D Family vCPU quota to be used for Standard_D1 instances.
If a quota increase is required to either purchase a Single Subscription RI, you can request a quota increase on your subscription.

