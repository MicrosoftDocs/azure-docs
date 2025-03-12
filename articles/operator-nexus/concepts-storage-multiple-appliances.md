```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: testPvc
  namespace: default
  annotations:
    storageApplianceName: exampleStorageAppliance
```