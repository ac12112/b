
"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WeatherWidget from "@/components/advanced/WeatherWidget";
import SafetyChatbot from "@/components/SafetyChatbot";
import Link from "next/link";
import Image from "next/image";
import EnhancedGrid from "@/components/enhanced/EnhancedGrid";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const canvasRef = useRef(null);
  const featureGridRef = useRef(null);
  const threeContainerRef = useRef(null);
  const testimonialRef = useRef(null);

  const sliderImages = [
    { id: 1080, text: "Emergency Response Teams" },
    { id: 1081, text: "Community Safety Patrols" },
    { id: 1082, text: "Disaster Preparedness" },
    { id: 1083, text: "Public Safety Awareness" },
    { id: 1084, text: "Crime Prevention Initiatives" },
  ];

  const testimonials = [
    {
      quote: "This system helped our community report a dangerous intersection. Within a week, traffic police were deployed and accidents reduced by 60%.",
      author: "Rahim M.",
      role: "Community Leader, Dhaka",
      image: 1001
    },
    {
      quote: "As a woman walking home at night, I feel safer knowing I can quickly report suspicious activity anonymously through this system.",
      author: "Tasnim F.",
      role: "University Student",
      image: 1002
    },
    {
      quote: "The integration with 999 emergency services saved my neighbor's life when we reported a medical emergency. Response time was under 8 minutes.",
      author: "Jamal H.",
      role: "Shop Owner, Chittagong",
      image: 1003
    }
  ];

  const faqs = [
    {
      question: "How does the anonymous reporting work?",
      answer: "Our system uses military-grade encryption to protect your identity. When you submit a report, we automatically remove all metadata and personally identifiable information before forwarding to authorities, while preserving the crucial details of your report."
    },
    {
      question: "What types of incidents can I report?",
      answer: "You can report any public safety concern including: criminal activity, traffic hazards, environmental issues, public health concerns, infrastructure problems, and suspicious activities. Our AI categorizes reports for proper routing."
    },
    {
      question: "How quickly will authorities respond?",
      answer: "Emergency reports are forwarded immediately to 999 services with priority handling. Non-emergency reports are typically addressed within 24-72 hours depending on severity. You'll receive status updates through your secure dashboard."
    },
    {
      question: "Can I add photos or videos to my report?",
      answer: "Yes, you can attach multimedia evidence while maintaining anonymity. All media is automatically stripped of metadata and processed through our secure encryption pipeline before being shared with authorities."
    }
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x07D348,
      transparent: true,
      opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x07D348,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 3;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      threeContainerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Enhanced Feature Grid Hover Effects
  useEffect(() => {
    if (!featureGridRef.current) return;

    const features = featureGridRef.current.querySelectorAll('.feature-item');
    
    features.forEach((feature, index) => {
      const image = feature.querySelector('.feature-image');
      
      feature.addEventListener('mouseenter', () => {
        gsap.to(feature, {
          scale: 1.05,
          boxShadow: '0 0 30px -5px rgba(7, 211, 72, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(image, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Create glowing particles
        for (let i = 0; i < 15; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 bg-[#07D348] rounded-full pointer-events-none glow-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          feature.appendChild(particle);

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * 150,
            opacity: 0,
            scale: 0,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => feature.removeChild(particle)
          });
        }
      });

      feature.addEventListener('mousemove', (e) => {
        const rect = feature.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(image, {
          x: x * 0.2,
          y: y * 0.2,
          rotation: x * 0.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      feature.addEventListener('mouseleave', () => {
        gsap.to(feature, {
          scale: 1,
          boxShadow: '0 0 20px -10px rgba(7, 211, 72, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(image, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      features.forEach(feature => {
        feature.removeEventListener('mouseenter', () => {});
        feature.removeEventListener('mousemove', () => {});
        feature.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Testimonial Hover Effects
  useEffect(() => {
    if (!testimonialRef.current) return;

    const cards = testimonialRef.current.querySelectorAll('.testimonial-card');

    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          scale: 1.05,
          boxShadow: '0 0 40px -5px rgba(7, 211, 72, 0.6)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const image = card.querySelector('.testimonial-image');
        gsap.to(image, {
          x: x * 0.1,
          y: y * 0.1,
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        });

        // Create glowing particles
        for (let i = 0; i < 10; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 bg-[#07D348] rounded-full pointer-events-none glow-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          card.appendChild(particle);

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => card.removeChild(particle)
          });
        }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          boxShadow: '0 0 20px -10px rgba(7, 211, 72, 0.3)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const image = card.querySelector('.testimonial-image');
        gsap.to(image, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 100 : 300;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(7, 211, 72, ${Math.random() * 0.5 + 0.1})`
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Generate rain particles
  const generateRainParticles = () => {
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
        size: Math.random() * 0.5 + 0.5
      });
    }
    
    return particles;
  };

  const rainParticles = generateRainParticles();

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <main className="relative px-6 pt-20 md:pt-7 overflow-hidden min-h-screen bg-[#0a0f0a]">
      <div ref={threeContainerRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10" />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rainParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-4 bg-[#07D348] rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `rain ${particle.duration}s linear ${particle.delay}s infinite`,
              opacity: particle.opacity,
              transform: `translateY(-100vh) scale(${particle.size})`,
            }}
          ></div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center relative z-10 py-20">
          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#07D348]/30 bg-[#07D348]/10 px-5 text-sm text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/50 hover:bg-[#07D348]/20">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15V17M6 21H18C19.1046 21 20 20.1046 arsen 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Secure & Anonymous Reporting
          </div>

          <h1 className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
            Report Incident
            <span className="block mt-3 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] bg-clip-text text-transparent relative">
              Protect Public Safety
              <div className="absolute inset-0 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] opacity-10 blur-3xl -z-10"></div>
            </span>
          </h1>

          <p className="mt-10 max-w-3xl text-xl leading-relaxed text-zinc-300">
            Your voice matters. Help create safer communities while maintaining 
            complete anonymity through our military-grade encrypted reporting system.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/40 hover:-translate-y-0.5">
                <span className="relative z-10">Make Report Now</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
            <Link href={"/auth/signin"}>
              <button className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348] group">
                <span>Login to Dashboard</span>
                <div className="w-0 h-[2px] bg-[#07D348] transition-all group-hover:w-5"></div>
              </button>
            </Link>
          </div>
        </section>

        {/* Enhanced Features Grid Section */}
        <section className="mt-20 relative">
          <EnhancedGrid />
        </section>

        {/* Community Safety in Action Slider */}
        <section className="mt-20 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-white bg-clip-text text-transparent">
            Community Safety in Action
          </h2>
          
          <div className="relative w-full overflow-hidden rounded-3xl border-2 border-white/20 h-96 md:h-[32rem]">
            {sliderImages.map((img, index) => (
              <div 
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={`https://picsum.photos/id/${img.id}/1600/900`}
                  alt={img.text}
                  width={1600}
                  height={900}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                  <h3 className="text-3xl font-bold">{img.text}</h3>
                  <p className="mt-4 text-xl max-w-2xl">See how our reporting system enhances public safety across communities</p>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-[#07D348] w-6' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/community">
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348]">
                <span>Join Our Community</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </section>

        {/* Bangladesh 999 Integration Section */}
        <section className="mt-40 rounded-3xl border-2 border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#07D348]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#24fe41]/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Integrated with Bangladesh National Emergency Service 999
              </h2>
              <p className="text-xl text-zinc-300 mb-8">
                Our system is directly connected to Bangladesh's official emergency response system, ensuring critical reports receive immediate attention from authorities.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Direct connection to police, fire, and medical services</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Automatic location sharing for faster response</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Priority handling of emergency reports</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white/20">
              <Image 
                src={`https://picsum.photos/id/1086/800/450`}
                alt="Bangladesh emergency response team"
                width={800}
                height={450}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="mt-40 relative overflow-x-hidden py-16" ref={testimonialRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07D348]/10 to-[#24fe41]/5 -z-10">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(7, 211, 72, 0.3) 0%, transparent 70%)`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center'
            }}></div>
          </div>
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#07D348] bg-clip-text text-transparent relative">
            What Citizens Are Saying
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-full blur-sm"></div>
          </h2>
          
          <div className="relative w-full h-[400px] sm:h-[380px] overflow-hidden">
            <div className="absolute top-0 left-0 h-full flex items-center gap-6 animate-marquee">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={`${index}-${testimonial.author}`}
                  className="testimonial-card inline-flex w-[300px] sm:w-[320px] p-5 rounded-2xl border-2 border-[#07D348]/30 bg-gradient-to-br from-[#0a0f0a]/50 to-[#07D348]/10 backdrop-blur-lg flex-shrink-0 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(7,211,72,0.5)] group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-full h-[200px] rounded-xl overflow-hidden border-2 border-[#07D348]/40 relative group/image">
                      <Image
                        src={`https://picsum.photos/id/${testimonial.image}/600/400`}
                        alt={testimonial.author}
                        width={600}
                        height={400}
                        className="testimonial-image object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07D348]/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium line-clamp-3">{testimonial.quote}</p>
                      <div className="mt-3 font-bold text-white text-lg sm:text-xl">{testimonial.author}</div>
                      <div className="text-xs sm:text-sm text-[#07D348] font-medium">{testimonial.role}</div>
                      <div className="flex mt-3 justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#07D348] group-hover:text-[#24fe41] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#0a0f0a] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-[#0a0f0a] to-transparent z-10"></div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-40">
          <h2 className="text-4xl font-bold text-center mb-16 bg-white bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl border-2 border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-[#07D348]/30"
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center group"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#07D348] transition-colors">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-[#07D348] transition-transform duration-300 ${activeFAQ === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-6 pb-6 text-zinc-300 transition-all duration-300 overflow-hidden ${activeFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mt-40 mb-12 text-center relative">
          <div className="absolute -top-20 left-1/2 w-64 h-64 bg-[#07D348]/10 rounded-full blur-3xl -translate-x-1/2 -z-10"></div>
          <h2 className="text-4xl font-bold mb-6 bg-white bg-clip-text text-transparent">
            Ready to Make Your Community Safer?
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Join thousands of Bangladeshi citizens who are making their neighborhoods safer through anonymous, secure reporting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/40 hover:-translate-y-0.5">
                <span className="relative z-10">Report an Incident</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
            <Link href={"/about"}>
              <button className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348] group">
                <span>Learn How It Works</span>
                <div className="w-0 h-[2px] bg-[#07D348] transition-all group-hover:w-5"></div>
              </button>
            </Link>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes rain {
          to {
            transform: translateY(100vh) scale(var(--tw-scale-x), var(--tw-scale-y));
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(10px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(7deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px -5px rgba(7, 211, 72, 0.3); }
          50% { box-shadow: 0 0 30px -5px rgba(7, 211, 72, 0.5); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-marquee {
          animation: marquee 15s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .glow-particle {
          box-shadow: 0 0 8px 2px rgba(7, 211, 72, 0.6);
        }
        .testimonial-card {
          transform: perspective(1000px);
        }
      `}</style>
      
      <SafetyChatbot/>
      <WeatherWidget/>
    </main>
  );
}