import * as k8s from "@pulumi/kubernetes";

// PersistentVolume
const postgresPv = new k8s.core.v1.PersistentVolume("postgres-pv", {
	metadata: { name: "postgres-pv" },
	spec: {
		capacity: { storage: "10Gi" },
		accessModes: ["ReadWriteOnce"],
		hostPath: { path: "/mnt/data/postgres" },
	},
});

// PersistentVolumeClaim
const postgresPvc = new k8s.core.v1.PersistentVolumeClaim("postgres-pvc", {
	metadata: { name: "postgres-pvc" },
	spec: {
		accessModes: ["ReadWriteOnce"],
		resources: { requests: { storage: "10Gi" } },
	},
});

// PostgreSQL Deployment
const postgresDeployment = new k8s.apps.v1.Deployment("postgresql", {
	metadata: { name: "postgresql" },
	spec: {
		replicas: 1,
		selector: { matchLabels: { app: "postgresql" } },
		template: {
			metadata: { labels: { app: "postgresql" } },
			spec: {
				containers: [
					{
						name: "postgres",
						image: "postgres",
						ports: [{ containerPort: 5432 }],
						env: [
							{ name: "POSTGRES_USER", value: "postgres" },
							{ name: "POSTGRES_PASSWORD", value: "password" },
							{ name: "POSTGRES_DB", value: "open-tech-summit-indonesia-2024" },
						],
						volumeMounts: [
							{
								mountPath: "/var/lib/postgresql/data",
								name: "postgres-storage",
							},
						],
					},
				],
				volumes: [
					{
						name: "postgres-storage",
						persistentVolumeClaim: { claimName: "postgres-pvc" },
					},
				],
			},
		},
	},
});

// PostgreSQL Service
const postgresService = new k8s.core.v1.Service("postgresql", {
	metadata: { name: "postgresql" },
	spec: {
		selector: { app: "postgresql" },
		ports: [{ protocol: "TCP", port: 5432, targetPort: 5432 }],
	},
});

// pgAdmin Deployment
const pgAdminDeployment = new k8s.apps.v1.Deployment("pgadmin", {
	metadata: { name: "pgadmin" },
	spec: {
		replicas: 1,
		selector: { matchLabels: { app: "pgadmin" } },
		template: {
			metadata: { labels: { app: "pgadmin" } },
			spec: {
				containers: [
					{
						name: "pgadmin",
						image: "dpage/pgadmin4",
						ports: [{ containerPort: 80 }],
						env: [
							{ name: "PGADMIN_DEFAULT_EMAIL", value: "admin@example.com" },
							{ name: "PGADMIN_DEFAULT_PASSWORD", value: "admin" },
						],
					},
				],
			},
		},
	},
});

// pgAdmin Service
const pgAdminService = new k8s.core.v1.Service("pgadmin", {
	metadata: { name: "pgadmin" },
	spec: {
		selector: { app: "pgadmin" },
		ports: [{ protocol: "TCP", port: 80, targetPort: 80 }],
	},
});

// OpenTechSummit2024 Deployment
const openTechSummitDeployment = new k8s.apps.v1.Deployment(
	"opentechsummit2024",
	{
		metadata: { name: "opentechsummit2024" },
		spec: {
			replicas: 8,
			selector: { matchLabels: { app: "opentechsummit2024" } },
			template: {
				metadata: { labels: { app: "opentechsummit2024" } },
				spec: {
					containers: [
						{
							name: "opentechsummit2024",
							image: "opentechsummit2024:latest",
							imagePullPolicy: "Never",
							ports: [{ containerPort: 8080 }],
							env: [
								{
									name: "DATABASE_URL",
									value:
										"postgresql://postgres:password@postgresql:5432/open-tech-summit-indonesia-2024",
								},
							],
						},
					],
				},
			},
		},
	},
);

// OpenTechSummit2024 Service
const openTechSummitService = new k8s.core.v1.Service("opentechsummit2024", {
	metadata: { name: "opentechsummit2024" },
	spec: {
		selector: { app: "opentechsummit2024" },
		ports: [{ protocol: "TCP", port: 3000, targetPort: 3000 }],
	},
});

// Export resource names
export const postgresPvName = postgresPv.metadata.name;
export const postgresPvcName = postgresPvc.metadata.name;
export const postgresDeploymentName = postgresDeployment.metadata.name;
export const postgresServiceName = postgresService.metadata.name;
export const pgAdminDeploymentName = pgAdminDeployment.metadata.name;
export const pgAdminServiceName = pgAdminService.metadata.name;
export const openTechSummitDeploymentName =
	openTechSummitDeployment.metadata.name;
export const openTechSummitServiceName = openTechSummitService.metadata.name;
