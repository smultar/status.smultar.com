import React, { useEffect, useState } from "react";
import Link from "next/link";

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

export function Service({ name, image, status, sub, index, selected, select}) {

    const [state, setState] = useState(indicator(status));

    useEffect(() => {
        setState(indicator(status));
    }, [status]);

    return (
        <div className={`service ${indicator(status).scss}`} onClick={select}>
            <div className='main'>
                <p className='ping'>{(status?.ping) ? status.ping : 'n/a'}</p>
                <img src={(image) ? image : '/svgs/smultar.svg'} layout='responsive' height={64} width={64}></img>
                <p className='name'>{(name) ? name : 'n/a'}</p>
                <p className='type'>{(status) ? status.type : 'n/a'}</p>
                <p className='status'>{(status) ? state.text : 'n/a'}</p>
            </div>

            { sub.length > 0 &&
                <div className={(selected) ? 'sub-services' : 'sub-services disabled'} style={{width: (selected) ? 180*sub.length : 0}}>
                    {
                        sub.map((service, index) => {
                                
                                return (
                                    <div className={`sub ${indicator(service.status).scss}`} key={index}>
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
    )
}
  