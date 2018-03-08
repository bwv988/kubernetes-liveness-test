# Kubernetes Liveness Test

## Overview

This is a small demo try out Liveness and Readiness probes in Kubernetes.

For deployment, we're using a Helm chart.

## Requirements

This needs a running Kubernetes cluster (e.g. via Rancher or minikube) with Helm installed.

```bash
# Verify Helm is able to contact Tiller.

helm ls
```

## Demo

### 1. Normal deployment

```bash
cd helm

# Instal the chart.
helm install kubelive/

# Generate printout for URL (using NodePort; couldn't get Ingress or LB to work in time).

export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services <FIXME>)
export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
# Navigate to this address.
echo http://$NODE_IP:$NODE_PORT

# Delete (ALL!!) chart(s).
helm delete $(helm ls -q)
```

### 2. Readiness probe

```bash
# We will simulate this by temporarily changing the probe endpoint.
cd kubelive/templates

# Change the Readiness probe API.
vi deployment.yaml

cd ../..
helm install kubelive/

# Now navigate to Kubernetes Dashboard --> Deployments & verify it failed.

# Clean up.
helm delete $(helm ls -q)

## DON'T FORGET TO UNDO HEALTHCHECK CHANGE!!!
```


### 3. Liveness probe

```bash
helm install kubelive/

# Run commands to display URL, as above....

export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services <FIXME>)
export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
# Navigate to this address
echo http://$NODE_IP:$NODE_PORT


# Then navigate to http://$NODE_IP:$NODE_PORT/api/shutdown

# Again, navigate to Kubernetes Dashboard --> Deployments & verify liveness probe failed at some stage.
# It will get restarted.

# Clean up.
helm delete $(helm ls -q)
``` 

