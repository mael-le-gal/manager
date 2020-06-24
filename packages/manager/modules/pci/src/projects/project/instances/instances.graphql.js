import gql from 'graphql-tag';

export const FRAGEMENT_INSTANCE = gql`
  fragment InstanceFileds on Instance {
    id
    name
    location
    region
    status
    flavor {
      name
      capabilities {
        name
        enabled
      }
      vcpus
      ram
      disk
      inboundBandwidth
      outboundBandwidth
    }
    image {
      name
      distribution
      user
      type
      tags
    }
    ipAddresses {
      ip
      type
      version
      gatewayIp
      networkId
    }
    volumes {
      id
      name
      size
    }
    monthlyBilling {
      since
      status
    }
    planCode
  }
`;

export const QUERY_INSTANCES = gql`
  query instances($projectId: String) {
    instances(projectId: $projectId) {
      ...InstanceFileds
    }
    vRack(projectId: $projectId) {
      id
      name
      description
    }
  }
  ${FRAGEMENT_INSTANCE}
`;

export const QUERY_INSTANCE = gql`
  query instance($projectId: String, $instanceId: String,) {
    instance(projectId: $projectId, instanceId: $instanceId) {
      ...InstanceFileds
    }
  }
  ${FRAGEMENT_INSTANCE}
`;

export const QUERY_INSTANCE_SSH_KEY = gql`
  query instanceSshKey($projectId: String, $instanceId: String,) {
    instance(projectId: $projectId, instanceId: $instanceId) {
      id
      sshKey {
        id
        name
      }
    }
  }
`;

export const QUERY_PRIVATE_NETWORKS = gql`
  query privateNetworks($projectId: String) {
    privateNetworks(projectId: $projectId) {
      id
      name
      status
      type
    }
  }
`;

export const QUERY_PUBLIC_NETWORKS = gql`
  query publicNetworks($projectId: String) {
    publicNetworks(projectId: $projectId) {
      id
      name
      status
      type
    }
  }
`;

export const QUERY_REGIONS = gql`
  query regions($projectId: String) {
    regions(projectId: $projectId) {
      continentCode
      datacenterLocation
      ipCountries
      name
      services {
        name
        status
        endpoint
      }
      status
      quota {
        instance {
          maxCores
          maxInstances
          maxRam
          usedCores
          usedInstances
          usedRAM
        }
        keypair {
          maxCount
        }
        region
        volume {
          maxGigabytes
          usedGigabytes
          volumeCount
        }
      }
    }
  }
`;

// mutations

export const MUTATION_CREATE_INSTANCE = gql`
  mutation createInstance(
    $projectId: String
    $instanceData: createInstanceInput
  ) {
    createInstance(projectId: $projectId, instanceData: $instanceData) {
      ...InstanceFileds
    }
  }
  ${FRAGEMENT_INSTANCE}
`;

export const MUTATION_DELETE_INSTANCE = gql`
  mutation deleteInstance($projectId: String, $instanceId: String) {
    deleteInstance(projectId: $projectId, instanceId: $instanceId) {
      id,
      status,
    }
  }
`;

export const MUTATION_UPDATE_INSTANCE = gql`
  mutation updateInstance(
    $projectId: String
    $instanceId: String
    $instanceName: String
  ) {
    updateInstance(
      projectId: $projectId
      instanceId: $instanceId
      instanceName: $instanceName
    ) {
      id,
      name,
    }
  }
`;

export default {
  FRAGEMENT_INSTANCE,
  QUERY_INSTANCES,
  QUERY_INSTANCE,
  QUERY_INSTANCE_SSH_KEY,
  QUERY_PRIVATE_NETWORKS,
  QUERY_PUBLIC_NETWORKS,
  QUERY_REGIONS,
  MUTATION_CREATE_INSTANCE,
  MUTATION_DELETE_INSTANCE,
  MUTATION_UPDATE_INSTANCE,
}
