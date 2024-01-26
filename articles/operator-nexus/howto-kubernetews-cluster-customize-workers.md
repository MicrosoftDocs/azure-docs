# Customize Worker Nodes with a DaemonSet

In order to configure worker nodes to meet specific application needs, it may be required to set certain sysctls, enable a linux module, etc. This is done with a DaemonSet which executes on each worker then applies a label to the worker as to not re-run on that node. This example sets registry.contoso.com to bypass the Cloud Services Network proxy for imagepulls, installs the SCTP kernel module and sets fs.inotify.max_user_instances to 4096, but it can be customized for any commands one might run in Linux. 

\```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: customized
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: customized
  template:
    metadata:
      labels:
        name: customized
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: customized
                    operator: NotIn
                    values:
                      - "1"
      tolerations:
        - operator: Exists
          effect: NoSchedule
      containers:
        - name: customized
          image: mcr.microsoft.com/cbl-mariner/base/core:1.0
          command:
            - nsenter
            - --target
            - "1"
            - --mount
            - --uts
            - --ipc
            - --net
            - --pid
            - --
            - bash
            - -exc
            - |
              sed -i '/registrycontoso.com/!s/NO_PROXY=/&registry.contoso.com,/' /etc/systemd/system/containerd.service.d/http-proxy.conf
              systemctl daemon-reload
              systemctl restart containerd
              modprobe sctp
              sed -i 's/^fs.inotify.max_user_instances.*/fs.inotify.max_user_instances     = 4096/' /etc/sysctl.d/90-system-max-limits.conf
              kubectl --kubeconfig=/etc/kubernetes/kubelet.conf label node ${HOSTNAME,,} customized=1
              sleep infinity
          resources:
            limits:
              memory: 200Mi
            requests:
              cpu: 100m
              memory: 16Mi
          securityContext:
            privileged: true
      hostNetwork: true
      hostPID: true
      hostIPC: true
      terminationGracePeriodSeconds: 0
\```
