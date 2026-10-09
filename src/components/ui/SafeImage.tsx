"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

/** Supports blob:/data: user photos and normal public paths. */
export function SafeImage({ src, alt, fill, className, width, height }: Props) {
  const isBlob = src.startsWith("blob:") || src.startsWith("data:");

  if (isBlob) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image src={src} alt={alt} fill className={className} unoptimized />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      className={className}
      unoptimized
    />
  );
}
