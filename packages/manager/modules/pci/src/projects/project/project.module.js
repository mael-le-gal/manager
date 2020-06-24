import angular from 'angular';
import AngularApollo from 'angular1-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import analyticsDataPlatform from './analytics-data-platform';
import baremetal from './baremetal';
import billing from './billing';
import contacts from './contacts';
import creating from './creating';
import dataProcessing from './data-processing';
import edit from './edit';
import failoverIps from './failover-ips';
import instances from './instances';
import kubernetes from './kubernetes';
import loadBalancer from './load-balancer';
import sshKeys from './ssh-keys';
import privateNetworks from './private-networks';
import quota from './quota';
import privateRegistry from './private-registry';
import sidebar from './sidebar';
import storages from './storages';
import users from './users';
import vouchers from './vouchers';
import regions from './regions';
import routing from './project.routing';
import streams from './streams';
import serving from './serving';
import workflow from './workflow';

import './project.less';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    AngularApollo,
    analyticsDataPlatform,
    baremetal,
    billing,
    contacts,
    creating,
    dataProcessing,
    edit,
    failoverIps,
    instances,
    loadBalancer,
    kubernetes,
    privateNetworks,
    quota,
    regions,
    privateRegistry,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    sidebar,
    storages,
    users,
    vouchers,
    streams,
    workflow,
    serving,
  ])
  .config(routing)
  .config(apolloProvider => {
    const uri = '/engine/2api/graphql';
    // const uri = 'https://www.ovh.com/engine/2api/graphql';
    // const uri = "http://localhost:8080/graphql";
    const httpLink = createHttpLink({
      uri,
      credentials: 'include',
      useGETForQueries: true,
      // headers: {
      //   'Cache-Control': 'public, max-age=5',
      // }
    });
    const pQueryLink = createPersistedQueryLink({ useGETForHashedQueries: true });
    const batchHttpLink = new BatchHttpLink({
      uri,
      credentials: 'include',
      headers: { batch: "true " },
      useGETForQueries: true,
    });
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );

      if (networkError) console.log(`[Network error]: ${networkError}`);
    });
    const cache = new InMemoryCache({
      cacheRedirects: {
        Query: {
          instance: (_, args, { getCacheKey }) => {
            return getCacheKey({ __typename: 'Instance', id: args.instanceId })
          },
        },
      },
    });
    const client = new ApolloClient({
      link: ApolloLink.from([
        errorLink,
        pQueryLink,
        httpLink,
        // batchHttpLink,
      ]),
      cache,
    });
    apolloProvider.defaultClient(client);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
