const cache = {
    tick: new Date().getTime(),
    services: null,
    packet: null,
};

const latency = (type, value) => {

    switch (type) {
        case 'ms': {
            return (value.toFixed(4) * 1000).toFixed(0);
        }
    };


}

export default async function handler(request, response) { 
    
    // Checks cache, if it's not expired, return cached data
    if (cache.tick >= new Date().getTime()) return response.status(200).json(cache.packet);

    // Fetch data from API
    const GrafanaFetch = async () => {

        let body = {
          from: `now-8h`, to: `${new Date().getTime()}`,
          queries: [
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://aetherlink.app/\", job=\"Aether Link - Live\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://aetherlink.app/\", job=\"Aether Link - Live\"} >= 0) by (probe)",
                hide: false,
                legendFormat: "AL-LIVE",
                range: true,
                refId: "Aether Link Live"
              },
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://beta.aetherlink.app/\", job=\"Aether Link - Beta\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://beta.aetherlink.app/\", job=\"Aether Link - Beta\"} >= 0) by (probe)",
                legendFormat: "AL-BETA",
                range: true,
                refId: "Aether Link Beta"
              },
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://dev.aetherlink.app/\", job=\"Aether Link - Development\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://dev.aetherlink.app/\", job=\"Aether Link - Development\"} >= 0) by (probe)",
                legendFormat: "AL-DEV",
                range: true,
                refId: "Aether Link Development"
              },
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://www.backblaze.com/\", job=\"Aether Link - CDN\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://www.backblaze.com/\", job=\"Aether Link - CDN\"} >= 0) by (probe)",
                legendFormat: "AL-CDN",
                range: true,
                refId: "Aether Link CDN"
              },              
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://prometheus.support/\", job=\"Prometheus - Dashboard\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://prometheus.support/\", job=\"Prometheus - Dashboard\"} >= 0) by (probe)",
                legendFormat: "PM-WEB",
                range: true,
                refId: "Prometheus Support"
              },
              {
                datasource: {
                  type: "prometheus",
                  uid: "grafanacloud-prom"
                },
                editorMode: "code",
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://smultar.com\", job=\"Smultar.com\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://smultar.com\", job=\"Smultar.com\"} >= 0) by (probe)",
                hide: false,
                legendFormat: "SMUL",
                range: true,
                refId: "Smultar.com"
              }
          ]
        };
    
        let options = { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Authorization': `Bearer ${process.env.TOKEN}`,
          },

          body: JSON.stringify(body),
    
        };
    
        let request = await fetch('https://smultar.grafana.net/api/ds/query', { ...options });
        let processed = await request.json();

        console.log(processed);

        return {
            aetherlink: {
                cdn: {
                    ping: (processed.results['Aether Link CDN'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Aether Link CDN'].frames[0].data.values
                },
                live: {
                    ping: (processed.results['Aether Link Live'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Aether Link Live'].frames[0].data.values
                },
                beta: {
                    ping: (processed.results['Aether Link Beta'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Aether Link Beta'].frames[0].data.values
                },
                dev: {
                    ping: (processed.results['Aether Link Development'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Aether Link Development'].frames[0].data.values
                }
            },

            blender: null,
            comissiant: null,
            prometheus: {
                live: {
                    ping: (processed.results['Prometheus Support'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Prometheus Support'].frames[0].data.values
                },
            },
            smultar: {
                live: {
                    ping: (processed.results['Smultar.com'].frames[0].data.values[1][0].toFixed(4) * 1000).toFixed(0),
                    data: processed.results['Smultar.com'].frames[0].data.values
                }
            },
            smgames: null,
        }
    
    };

    // Set cache
    cache.tick = new Date().getTime() + 60000;
    cache.services = await GrafanaFetch();

    let packet = {
        tick: new Date(),
        services: [
            {
                name: 'aether link',
                image: '/svgs/aetherlink.svg',
                status: {
                    ping: cache.services.aetherlink.live.ping,
                    data: cache.services.aetherlink.live.data,
                    type: 'API/WEBSITE',
                    state: 'active',
                    url: 'https://aetherlink.app/',

                },
                sub: [
                    {
                        name: 'content delivery',
                        image: '/svgs/aetherlink-cdn.svg',
                        status: {
                            ping: cache.services.aetherlink.cdn.ping,
                            data: cache.services.aetherlink.cdn.data,
                            type: 'upload server',
                            state: 'active',
                            url: 'https://cdn.aetherlink.app/',
                        },
                    },
                    {
                        name: 'beta',
                        image: '/svgs/aetherlink-beta.svg',
                        status: {
                            ping: cache.services.aetherlink.beta.ping,
                            data: cache.services.aetherlink.beta.data,
                            type: 'WEBSITE',
                            state: 'active',
                            url: 'https://beta.aetherlink.app/',
                        },
                    },
                    {
                        name: 'dev',
                        image: '/svgs/aetherlink-dev.svg',
                        status: {
                            ping: cache.services.aetherlink.dev.ping,
                            data: cache.services.aetherlink.dev.data,
                            type: 'WEBSITE',
                            state: 'active',
                            url: 'https://dev.aetherlink.app/',
                        },
                    },
                ]
            },
            {
                name: 'blender',
                image: '/svgs/blender.svg',
                status: {
                    ping: 0,
                    data: null,
                    type: 'bot/website',
                    state: 'active',
                },
                sub: [
                    {
                        name: 'blender.bot',
                        image: '/svgs/blender-bot.svg',
                        status: {
                            ping: 0,
                            data: null,
                            type: 'discord bot',
                            state: 'disabled',
                        },
                    },
                    {
                        name: 'blender.tips',
                        image: '/svgs/blender-web.svg',
                        status: {
                            ping: 0,
                            data: null,
                            type: 'website',
                            state: 'disabled',
                        },
                    },
                ]
            },
            {
                name: 'comissiant',
                image: '/svgs/commissant.svg',
                status: {
                    ping: 0,
                    data: null,
                    type: 'in development',
                    state: 'dev',
                },
                sub: []
            },
            {
                name: 'prometheus',
                image: '/svgs/prometheus.svg',
                status: {
                    ping: 0,
                    data: null,
                    type: 'bot/website',
                    state: 'dev',
                },
                sub: []
            },
            {
                name: 'smultar',
                image: '/svgs/smultar.svg',
                status: {
                    ping: cache.services.smultar.live.ping,
                    data: cache.services.smultar.live.data,
                    type: 'website',
                    state: 'active',
                },
                sub: []
            },
            {
                name: 'smultar.games',
                image: '/svgs/smultar.svg',
                status: {
                    ping: 0,
                    data: null,
                    type: 'pr/game/service',
                    state: 'disabled',
                },
                sub: []
            },
        ]
    }

    cache.packet = packet;

    response.status(200).json(cache.packet);
  }
  