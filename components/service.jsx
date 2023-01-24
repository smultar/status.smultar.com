import React, { useEffect, useState } from "react";
import Chart from './chart';
import classNames from 'classnames';

const indicator = (status) => {

    switch (status.state) {

        case "disabled": {
            return {
                scss: 'disabled',
                text: 'disabled',
            };
        }

        case "dev": {
            return {
                scss: 'dev',
                text: 'soon™️',
            };
        }

        case "main": {
            return 'main';
        }

        case "active": {
            if (status.ping >= 450) { 
                return {
                    scss: 'fail',
                    text: 'critical',
                }

            } else if (status.ping >= 350) { 
                return {
                    scss: 'slow',
                    text: 'severe load',
                }

            } else if (status.ping >= 250) { 
                return {
                    scss: 'load',
                    text: 'light load',
                }

            } else if (status.ping >= 1) { 
                return {
                    scss: 'on',
                    text: 'online',
                }
                    
            } else {
                return {
                    scss: 'off',
                    text: 'offline',
                }
            }
        }

        default: {
            return {
                scss: 'default',
                text: 'unknown',
            };
        }

    }
}

export function Service({ name, image, status, sub, index, selected, select, mode}) {

    const [state, setState] = useState(indicator(status));
    const [graph, setGraph] = useState(0);

    useEffect(() => {
        setState(indicator(status));
    }, [status]);

    return (
        <div className='service-container'>
            <div className={classNames(`service ${indicator(status).scss}`, { graph: mode })} onClick={select}>
                <div className='main' onMouseEnter={() => setGraph(0)}>
                    <p className='ping'>{status?.ping ?? 'n/a'}</p>
                    <img src={(image) ? image : '/svgs/smultar.svg'} layout='responsive' height={64} width={64}></img>
                    <p className='name'>{name ?? 'n/a'}</p>
                    <p className='type'>{status?.type ?? 'n/a'}</p>
                    <p className='status'>{state.text ?? 'n/a'}</p>
                </div>

                { sub.length > 0 &&
                    <div className={(selected) ? 'sub-services' : 'sub-services disabled'} style={{width: (selected) ? 180 * sub.length : 0}}>
                        {
                            sub.map((service, index) => {
                                    
                                    return (
                                        <div className={`sub ${indicator(service.status).scss}`} key={index} onMouseEnter={() => setGraph(index + 1)}>
                                            <p className='ping'>{(status?.ping) ? service.status.ping : 'n/a'}</p>
                                            <img src={(service.image) ? service.image : '/svgs/code.svg'} layout='responsive' height={64} width={64}></img>
                                            <p className='name'>{(service) ? service.name : 'n/a'}</p>
                                            <p className='type'>{(status) ? service.status.type : 'n/a'}</p>
                                            <p className='status'>{(status) ? indicator(service.status).text : 'n/a'}</p>
                                        </div>
                                    )
                                    
                                }
                                )
                            }
                    </div>
                }

            </div>
            { status?.data &&
                <div className={classNames('graph-container', { selected: mode && selected })} style={{width: (selected) ? 180 * sub.length + 180 : 0 }}>
                    <div className={classNames('graph', { enabled: graph == 0})}>
                        <Chart name={name.toUpperCase()} data={status?.data}/>
                    </div>
                    { sub.length > 0 && sub.map((service, index) => {
                                
                                return (
                                    <div className={classNames('graph', { enabled: graph == index + 1})} key={index} onMouseEnter={() => setGraph(index + 1)}>
                                        <Chart name={service.name.toUpperCase()} data={service.status.data}/>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            }
        </div>
    )
}
  