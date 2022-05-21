import { Service } from '../components/service.jsx';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';


const Main = () => {

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const fetchServices = async () => {

    const request = await fetch('/api/services');
    const response = await request.json();

    setServices([...response.services]); setRefresh(1);
  }

  useEffect(() => {
      
    setTimeout(() => {
      fetchServices();
    }, 2 * 1000);

    setInterval(() => {
      fetchServices();
    }, 30 * 1000);

  }, []);

  useEffect(() => {
    const interval = setInterval(() => setRefresh((time) => time + 1),1 * 1000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className='page'>
      <Head>
        <title>Status | Smultar</title>
        <meta name="description" content="Supporting mods creators around the globe." />
        <link rel="icon" href="/svgs/smultar.svg" />
      </Head>

      <div className='page-content'>
            <div className='grid'>
              <div className='top'>
                <img src='/svgs/smultar.svg' layout='responsive' onClick={() => {Fetch()}}></img>
                <div className='text-fields'>
                  <p className='title'>smultar status</p>
                  <p className='subtitle'>performance at a glance <span>V{process.env.VERSION} build ({process.env.BUILD})</span></p>
                  { services.length == 0 && 
                    <p className='refresh'>Its been <span>{refresh}</span> second{(refresh > 1) ? 's': ''} ago</p>
                  }
                  { services.length >= 1 && 
                    <p className='refresh'>Last refresh was <span>{refresh}</span> second{(refresh > 1) ? 's': ''} ago</p>
                  }
                </div>
              </div>

              <div className='services'>
                { services.length == 0 && 
                  <p className='loading'><img src='/svgs/loading.svg'></img>Contacting Enceladus Network</p>
                }
                { services.length >= 1 && 
                  services.map((service, index) => {
                      console.log(service);

                      return (
                        <Service key={index} name={service.name} image={service.image} status={service.status} sub={service.sub} index={index} selected={(selected == index)} select={() => {(selected == index) ? setSelected(null) : setSelected(index)}}/>
                      )
                    }
                  )
                }
              </div>

              { services.length >= 1 && 
                <p className='info'>This is a general overview of all of my services, to see more information on a per cluster/service basis by clicking on it instead.</p>
              }
              
              <div className='fade'></div>

            </div>
              <div className='footer'>
                <p>Feel like something is broken? Contact <Link href="https://discord.gg/pBHJU7c"><span>Smultar</span></Link></p>
              </div>
        </div>

    </div>
  )
};

export default dynamic(() => Promise.resolve(Main), { ssr: false });
