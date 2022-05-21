const cache = {
    tick: new Date().getTime(),
    services: null,
    packet: null,
};

const latency = (type, value) => {

    switch (type) {
        case 'ms': {
            value = value.toFixed(4);

            value = value * 1000;

            value = value.toFixed(0)
            return value;
        }
    };


}


export default async function handler(request, response) { 
    
    // Checks cache, if it's not expired, return cached data
    if (cache.tick >= new Date().getTime()) return response.status(200).json(cache.packet);

    // Fetch data from API
    const GrafanaFetch = async () => {

        let body = {
          from: `${new Date().getTime()}`, to: `${new Date().getTime()}`,
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
                expr: "avg(probe_duration_seconds{probe=~\".*\", instance=\"https://prometheus.support/\", job=\"Prometheus - Dashboard\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\".*\",instance=\"https://prometheus.support/\", job=\"Prometheus - Dashboard\"} >= 0) by (probe)",
                legendFormat: "PM-WEB",
                range: true,
                refId: "Prometheus Support"
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
                live: {
                    ping: latency('ms', processed.results['Aether Link Live'].frames[0].data.values[1][0]),
                },
                beta: {
                    ping: latency('ms', processed.results['Aether Link Beta'].frames[0].data.values[1][0]),
                },
                dev: {
                    ping: latency('ms', processed.results['Aether Link Development'].frames[0].data.values[1][0]),
                }
            },

            blender: null,
            comissiant: null,
            prometheus: {
                live: {
                    ping: latency('ms', processed.results['Prometheus Support'].frames[0].data.values[1][0]),
                },
            },
            smultar: null,
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
                    type: 'API/WEBSITE',
                    state: 'active',
                    url: 'https://aetherlink.app/',
                },
                sub: [
                    {
                        name: 'content delivery',
                        image: '/svgs/aetherlink-cdn.svg',
                        status: {
                            ping: 0,
                            type: 'upload server',
                            state: 'disabled',
                            url: 'https://cdn.aetherlink.app/',
                        },
                    },
                    {
                        name: 'beta',
                        image: '/svgs/aetherlink-beta.svg',
                        status: {
                            ping: cache.services.aetherlink.beta.ping,
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
                    type: 'bot/website',
                    state: 'active',
                },
                sub: [
                    {
                        name: 'blender.bot',
                        image: '/svgs/blender-bot.svg',
                        status: {
                            ping: 0,
                            type: 'discord bot',
                            state: 'disabled',
                        },
                    },
                    {
                        name: 'blender.tips',
                        image: '/svgs/blender-web.svg',
                        status: {
                            ping: 0,
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
                    type: 'bot/website',
                    state: 'dev',
                },
                sub: []
            },
            {
                name: 'smultar',
                image: '/svgs/smultar.svg',
                status: {
                    ping: 0,
                    type: 'website',
                    state: 'dev',
                },
                sub: []
            },
            {
                name: 'smultar.games',
                image: '/svgs/smultar.svg',
                status: {
                    ping: 0,
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
  